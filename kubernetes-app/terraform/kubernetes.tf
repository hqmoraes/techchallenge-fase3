# kubernetes-app/terraform/kubernetes.tf

resource "kubernetes_namespace" "fastfood" {
  metadata {
    name = "fastfood"
  }
}

# Service Account para a aplicação com annotations para IRSA
resource "kubernetes_service_account" "app" {
  metadata {
    name      = "fastfood-app-sa"
    namespace = kubernetes_namespace.fastfood.metadata[0].name
    annotations = {
      "eks.amazonaws.com/role-arn" = var.dynamodb_role_arn
    }
  }
  
  automount_service_account_token = true
}

# Service Account para acesso aos secrets
resource "kubernetes_service_account" "secrets" {
  metadata {
    name      = "fastfood-secrets-sa"
    namespace = kubernetes_namespace.fastfood.metadata[0].name
    annotations = {
      "eks.amazonaws.com/role-arn" = var.secrets_role_arn
    }
  }
  
  automount_service_account_token = true
}

# Variáveis para receber os ARNs das IAM Roles
variable "dynamodb_role_arn" {
  description = "ARN da IAM Role para acesso ao DynamoDB"
  type        = string
}

variable "secrets_role_arn" {
  description = "ARN da IAM Role para acesso ao Secrets Manager"
  type        = string
}