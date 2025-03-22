variable "aws_region" {
  description = "Região AWS onde os recursos serão criados"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Nome do projeto para tagging consistente"
  type        = string
  default     = "FastFood"
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

variable "dynamodb_billing_mode" {
  description = "Modo de faturamento para tabelas com tráfego previsível"
  type        = string
  default     = "PROVISIONED"
}

variable "dynamodb_read_capacity" {
  description = "Capacidade de leitura provisionada para tabelas DynamoDB"
  type        = number
  default     = 5
}

variable "dynamodb_write_capacity" {
  description = "Capacidade de escrita provisionada para tabelas DynamoDB"
  type        = number
  default     = 5
}

variable "enable_point_in_time_recovery" {
  description = "Habilitar recuperação point-in-time para tabelas DynamoDB"
  type        = bool
  default     = true
}