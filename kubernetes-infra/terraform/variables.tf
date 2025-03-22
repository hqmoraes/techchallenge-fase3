# Variáveis básicas para configuração de ambiente
variable "region" {
  description = "Região da AWS onde os recursos serão criados"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Ambiente de implantação (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "fastfood"
}

variable "aws_account_id" {
  description = "ID da conta AWS"
  type        = string
  default     = ""
}

# Variáveis específicas para EKS
variable "cluster_name" {
  description = "Nome do cluster EKS"
  type        = string
  default     = "fastfood-cluster"
}

variable "cluster_version" {
  description = "Versão do Kubernetes para o cluster EKS"
  type        = string
  default     = "1.27"
}

variable "eks_namespace" {
  description = "Namespace Kubernetes para a aplicação Fast Food"
  type        = string
  default     = "fastfood"
}

# Variáveis de rede
variable "vpc_cidr" {
  description = "CIDR da VPC principal"
  type        = string
  default     = "10.0.0.0/16"
}

variable "private_subnets" {
  description = "Lista de CIDRs para subnets privadas"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "public_subnets" {
  description = "Lista de CIDRs para subnets públicas"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "vpc_name" {
  description = "Nome da VPC"
  type        = string
  default     = "eks-vpc"
}

variable "create_vpc_endpoints" {
  description = "Se deve criar endpoints de VPC para serviços AWS"
  type        = bool
  default     = false
}

# Variáveis de recursos de computação
variable "node_instance_types" {
  description = "Tipos de instância para os nós do EKS"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "node_group_desired_size" {
  description = "Número desejado de nós no grupo"
  type        = number
  default     = 2
}

variable "node_group_max_size" {
  description = "Número máximo de nós no grupo"
  type        = number
  default     = 3
}

variable "node_group_min_size" {
  description = "Número mínimo de nós no grupo"
  type        = number
  default     = 1
}

variable "enable_cluster_autoscaler" {
  description = "Se deve habilitar o autoscaler do cluster EKS"
  type        = bool
  default     = true
}

# Variáveis para autenticação e autorização
variable "additional_roles_for_eks_auth" {
  description = "Roles adicionais para acesso ao cluster EKS"
  type        = list(object({
    rolearn  = string
    username = string
    groups   = list(string)
  }))
  default     = []
}

variable "additional_users_for_eks_auth" {
  description = "Usuários adicionais para acesso ao cluster EKS"
  type        = list(object({
    userarn  = string
    username = string
    groups   = list(string)
  }))
  default     = []
}

# Variáveis de integração com outros módulos
variable "dynamodb_table_name" {
  description = "Nome da tabela DynamoDB principal (recebido do módulo database-infra)"
  type        = string
  default     = ""
}

variable "dynamodb_table_arn" {
  description = "ARN da tabela DynamoDB (recebido do módulo database-infra)"
  type        = string
  default     = ""
}

variable "aws_region" {
  description = "Região da AWS onde os recursos serão criados"
  type        = string
  default     = "us-east-1"  # Valor padrão, pode ser substituído
}

variable "subnet_ids" {
  description = "List of subnet IDs for EKS cluster"
  type        = list(string)
  default     = ["subnet-example1", "subnet-example2"] # Substitua por IDs reais ou deixe vazio
}

variable "dynamodb_endpoint" {
  description = "Endpoint personalizado para o DynamoDB (opcional)"
  type        = string
  default     = null
}

variable "eks_cluster_name" {
  description = "Nome do cluster EKS"
  type        = string
  default     = "fastfood-cluster"
}

# Variáveis adicionais que podem estar presentes no terraform.tfvars
variable "create_dynamodb_table" {
  description = "Se deve criar tabela DynamoDB"
  type        = bool
  default     = true
}

variable "node_group_desired_capacity" {
  description = "Capacidade desejada do node group EKS"
  type        = number
  default     = 2
}

# Variáveis para DynamoDB
variable "dynamodb_clients_table" {
  description = "Nome da tabela de clientes no DynamoDB"
  type        = string
  default     = "fastfood-clients"
}

variable "dynamodb_products_table" {
  description = "Nome da tabela de produtos no DynamoDB"
  type        = string
  default     = "fastfood-products"
}

variable "dynamodb_categories_table" {
  description = "Nome da tabela de categorias no DynamoDB"
  type        = string
  default     = "fastfood-categories"
}

variable "dynamodb_orders_table" {
  description = "Nome da tabela de pedidos no DynamoDB"
  type        = string
  default     = "fastfood-orders"
}

variable "dynamodb_payments_table" {
  description = "Nome da tabela de pagamentos no DynamoDB"
  type        = string
  default     = "fastfood-payments"
}

# Variáveis sensíveis para APIs externas
variable "mercado_pago_token" {
  description = "Token de acesso à API do Mercado Pago"
  type        = string
  sensitive   = true
  default     = "TEST-TOKEN"  # Valor padrão apenas para desenvolvimento
}

variable "jwt_secret" {
  description = "Secret para assinatura de tokens JWT"
  type        = string
  sensitive   = true
  default     = "default-jwt-secret-key-for-development"  # Valor padrão apenas para desenvolvimento
}

# Adicionar esta variável ao arquivo de variáveis existente

variable "lambda_auth_arn" {
  description = "ARN da função Lambda de autenticação"
  type        = string
  default     = ""
}

