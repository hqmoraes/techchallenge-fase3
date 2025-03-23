# Outputs corretos do módulo ECR

output "repository_url" {
  description = "The URL of the repository"
  value       = aws_ecr_repository.fastfood_app.repository_url
}

output "registry_id" {
  description = "The registry ID where the repository was created"
  value       = aws_ecr_repository.fastfood_app.registry_id
}

output "repository_name" {
  description = "The name of the repository"
  value       = aws_ecr_repository.fastfood_app.name
}

output "ecr_login_command" {
  description = "The command to use to login to ECR"
  value       = "aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${aws_ecr_repository.fastfood_app.registry_id}.dkr.ecr.${var.aws_region}.amazonaws.com"
}

output "repository_arn" {
  description = "The ARN of the repository"
  value       = aws_ecr_repository.fastfood_app.arn
}


