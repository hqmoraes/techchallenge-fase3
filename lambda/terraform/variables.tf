# Arquivo: terraform/variables.tf
variable "dynamodb_clients_table" {
  description = "Nome da tabela DynamoDB que armazena os clientes"
  type        = string
  default     = "FastFoodClients"
}

variable "jwt_secret" {
  description = "Segredo para assinatura de tokens JWT"
  type        = string
  sensitive   = true
  default     = "change-me-in-production" # Idealmente deve ser fornecido via variável de ambiente ou sistema de gerenciamento de segredos
}

variable "aws_region" {
  description = "Região AWS onde os recursos serão criados"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Ambiente de implantação (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "tags" {
  description = "Tags padrão para todos os recursos"
  type        = map(string)
  default = {
    Project     = "FastFood"
    Application = "Microservices"
    ManagedBy   = "Terraform"
    Owner       = "DevOps"
  }
}

variable "dynamodb_table_arn" {
  description = "ARN da tabela DynamoDB para a função Lambda"
  type        = string
  default     = ""
}