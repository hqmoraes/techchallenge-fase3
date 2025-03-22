# Remote state para o módulo database-infra
# Acesso a recursos do DynamoDB para autenticação de clientes
data "terraform_remote_state" "database" {
  backend = "s3"
  
  config = {
    bucket = "fiap-techchallenge"
    key    = "fastfood/database-infra-terraform/terraform.tfstate"
    region = "us-east-1"
  }
}
