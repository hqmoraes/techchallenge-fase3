# Backend S3 para o módulo Lambda
# Armazena o estado da infraestrutura para o microsserviço de autenticação
terraform {
  backend "s3" {
    bucket         = "fiap-techchallenge"
    key            = "fastfood/lambda-terraform/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}
