# Outputs corretos do módulo ECR

output "repository_url" {
  description = "URL do repositório ECR para a aplicação Fast Food"
  value       = aws_ecr_repository.fastfood_app.repository_url
}

output "repository_name" {
  description = "Nome do repositório ECR para a aplicação Fast Food"
  value       = aws_ecr_repository.fastfood_app.name
}

output "repository_arn" {
  description = "ARN do repositório ECR para a aplicação Fast Food"
  value       = aws_ecr_repository.fastfood_app.arn
}

output "repository_registry_id" {
  description = "ID do registro ECR onde o repositório foi criado"
  value       = aws_ecr_repository.fastfood_app.registry_id
}

output "repository_url_with_tag" {
  description = "URL do repositório ECR com tag latest"
  value       = "${aws_ecr_repository.fastfood_app.repository_url}:latest"
}

# Outputs
output "ecr_repository_url" {
  value       = module.ecr.repository_url
  description = "URI do repositório ECR para a aplicação Fast Food"
}
