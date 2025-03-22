variable "aws_account_id" {
  description = "ID da conta AWS"
  type        = string
  default     = 691780621308
}

variable "region" {
  description = "Região da AWS"
  type        = string
  default     = "us-east-1"
}

variable "dynamodb_endpoint" {
  description = "Endpoint personalizado para o DynamoDB (opcional)"
  type        = string
  default     = null
}

variable "create_vpc_endpoints" {
  description = "Se deve criar endpoints de VPC para serviços AWS"
  type        = bool
  default     = false
}

variable "vpc_cidr" {
  description = "CIDR da VPC principal"
  type        = string
  default     = "10.0.0.0/16"
}

variable "vpc_name" {
  description = "Nome da VPC"
  type        = string
  default     = "eks-vpc"
}

variable "eks_cluster_name" {
  description = "Nome do cluster EKS"
  type        = string
  default     = "fastfood-cluster"
}

variable "eks_namespace" {
  description = "Namespace Kubernetes para a aplicação Fast Food"
  type        = string
  default     = "fastfood"
}

# Variáveis adicionais que podem estar presentes no terraform.tfvars
variable "create_dynamodb_table" {
  description = "Se deve criar tabela DynamoDB"
  type        = bool
  default     = true
}

variable "dynamodb_table_name" {
  description = "Nome da tabela DynamoDB"
  type        = string
  default     = "fastfood"
}

variable "enable_cluster_autoscaler" {
  description = "Se deve habilitar o autoscaler do cluster EKS"
  type        = bool
  default     = true
}

variable "node_group_desired_capacity" {
  description = "Capacidade desejada do node group EKS"
  type        = number
  default     = 2
}

variable "node_group_min_size" {
  description = "Tamanho mínimo do node group EKS"
  type        = number
  default     = 1
}

variable "node_group_max_size" {
  description = "Tamanho máximo do node group EKS"
  type        = number
  default     = 4
}

variable "environment" {
  description = "Ambiente de implantação (dev, stage, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "fastfood"
}

variable "eks_node_role" {
  description = "Nome do IAM Role dos nós do EKS"
  type        = string
  default     = ""
}

variable "ecr_repository_name" {
  description = "Nome base do repositório ECR"
  type        = string
  default     = "fastfood-app"
}

variable "image_tag_mutability" {
  description = "Configuração de mutabilidade das tags de imagem (MUTABLE ou IMMUTABLE)"
  type        = string
  default     = "MUTABLE"
}

variable "scan_on_push" {
  description = "Habilitar verificação de vulnerabilidades ao fazer push de imagens"
  type        = bool
  default     = true
}

variable "max_image_count" {
  description = "Número máximo de imagens a serem mantidas no repositório"
  type        = number
  default     = 10
}