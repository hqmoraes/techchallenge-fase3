# kubernetes-app/terraform/deployment.tf

resource "kubernetes_deployment" "app" {
  metadata {
    name      = "fastfood-app"
    namespace = kubernetes_namespace.fastfood.metadata[0].name
    labels = {
      app = "fastfood"
    }
  }

  spec {
    replicas = 3

    selector {
      match_labels = {
        app = "fastfood"
      }
    }

    template {
      metadata {
        labels = {
          app = "fastfood"
        }
        annotations = {
          "prometheus.io/scrape" = "true"
          "prometheus.io/port"   = "3000"
          "prometheus.io/path"   = "/metrics"
        }
      }

      spec {
        service_account_name = kubernetes_service_account.app.metadata[0].name
        
        container {
          name  = "fastfood-app"
          image = "${var.ecr_repository_url}/fastfood-app:latest"
          
          port {
            container_port = 3000
          }
          
          env {
            name  = "NODE_ENV"
            value = "production"
          }
          
          env {
            name  = "PORT"
            value = "3000"
          }
          
          # As credenciais serão acessadas via AWS SDK usando o IAM Role
          # O SDK usa automaticamente as credenciais da IAM Role anexada ao Service Account
          
          resources {
            limits = {
              cpu    = "500m"
              memory = "512Mi"
            }
            requests = {
              cpu    = "100m"
              memory = "128Mi"
            }
          }
          
          liveness_probe {
            http_get {
              path = "/health"
              port = 3000
            }
            initial_delay_seconds = 30
            period_seconds        = 30
          }
          
          readiness_probe {
            http_get {
              path = "/ready"
              port = 3000
            }
            initial_delay_seconds = 15
            period_seconds        = 15
          }
        }
        
        # Container auxiliar para inicialização com secrets
        init_container {
          name  = "init-secrets"
          image = "amazon/aws-cli:latest"
          
          # Este container vai buscar os secrets e salvar em um volume compartilhado
          command = ["/bin/bash", "-c"]
          args    = [
            <<-EOT
            # Obter secrets e salvar em arquivos
            aws secretsmanager get-secret-value --secret-id ${var.database_secret_arn} --query SecretString --output text > /secrets/database.json
            aws secretsmanager get-secret-value --secret-id ${var.external_api_secret_arn} --query SecretString --output text > /secrets/external-api.json
            # Converter para formato usado pela aplicação
            echo "Secrets foram carregados com sucesso"
            EOT
          ]
          
          volume_mount {
            name       = "secrets-volume"
            mount_path = "/secrets"
          }
        }
        
        # Volume efêmero para armazenar secrets
        volume {
          name = "secrets-volume"
          empty_dir {
            medium = "Memory"
          }
        }
      }
    }
  }
}

# Variáveis adicionais
variable "ecr_repository_url" {
  description = "URL do repositório ECR para a imagem da aplicação"
  type        = string
}

variable "database_secret_arn" {
  description = "ARN do secret de credenciais do banco de dados"
  type        = string
}

variable "external_api_secret_arn" {
  description = "ARN do secret de credenciais de APIs externas"
  type        = string
}