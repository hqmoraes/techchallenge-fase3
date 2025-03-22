# Namespace para aplicação Fast Food
resource "kubernetes_namespace" "fastfood" {
  metadata {
    name = "fastfood"
    
    labels = {
      app = var.project_name
      environment = var.environment
    }
  }

  depends_on = [
    aws_eks_cluster.fastfood,
    aws_eks_node_group.fastfood
  ]
}

# Secret para credenciais do DynamoDB
resource "kubernetes_secret" "dynamodb_credentials" {
  metadata {
    name      = "dynamodb-credentials"
    namespace = kubernetes_namespace.fastfood.metadata[0].name
  }

  data = {
    region           = var.region
    clients_table    = var.dynamodb_clients_table
    products_table   = var.dynamodb_products_table
    categories_table = var.dynamodb_categories_table
    orders_table     = var.dynamodb_orders_table
    payments_table   = var.dynamodb_payments_table
  }

  type = "Opaque"

  depends_on = [
    kubernetes_namespace.fastfood
  ]
}

# Secret para credenciais de APIs externas
resource "kubernetes_secret" "api_credentials" {
  metadata {
    name      = "api-credentials"
    namespace = kubernetes_namespace.fastfood.metadata[0].name
  }

  data = {
    mercado_pago_token = var.mercado_pago_token
    jwt_secret         = var.jwt_secret
  }

  type = "Opaque"

  depends_on = [
    kubernetes_namespace.fastfood
  ]
}

# ConfigMap para configurações da aplicação
resource "kubernetes_config_map" "app_config" {
  metadata {
    name      = "app-config"
    namespace = kubernetes_namespace.fastfood.metadata[0].name
  }

  data = {
    environment = var.environment
    api_url     = "https://api.fastfood.com"
    log_level   = "info"
  }

  depends_on = [
    kubernetes_namespace.fastfood
  ]
}

# ServiceAccount para a aplicação principal
resource "kubernetes_service_account" "app_service_account" {
  metadata {
    name      = "fastfood-app"
    namespace = kubernetes_namespace.fastfood.metadata[0].name
    
    annotations = {
      "eks.amazonaws.com/role-arn" = aws_iam_role.app_role.arn
    }
  }

  depends_on = [
    kubernetes_namespace.fastfood
  ]
}

# Outputs para uso em scripts de deploy
output "kubernetes_namespace" {
  value = kubernetes_namespace.fastfood.metadata[0].name
  description = "Namespace Kubernetes para a aplicação Fast Food"
}

output "app_service_account" {
  value = kubernetes_service_account.app_service_account.metadata[0].name
  description = "Nome do ServiceAccount principal da aplicação"
}