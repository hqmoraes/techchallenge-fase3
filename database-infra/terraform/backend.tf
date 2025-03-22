terraform {
  backend "s3" {
    bucket         = "fiap-techchallenge"
    key            = "fastfood/database-infra-terraform/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}
