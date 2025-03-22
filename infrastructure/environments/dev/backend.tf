terraform {
  backend "s3" {
    bucket         = "fiap-techchallenge"
    key            = "fastfood/dev/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}
