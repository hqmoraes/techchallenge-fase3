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
