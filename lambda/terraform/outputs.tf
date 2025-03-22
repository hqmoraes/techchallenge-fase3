# terraform/outputs.tf
output "api_gateway_url" {
  description = "URL do API Gateway para autenticação"
  value       = aws_apigatewayv2_api.auth_api.api_endpoint
}

output "lambda_arn" {
  description = "ARN da função Lambda de autenticação"
  value       = aws_lambda_function.auth_function.arn
}

output "dynamodb_table_name" {
  description = "Nome da tabela DynamoDB para clientes"
  value       = var.dynamodb_clients_table
}

output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = "${aws_apigatewayv2_api.fastfood_api.api_endpoint}/auth"
}

output "api_id" {
  description = "API Gateway ID"
  value       = aws_apigatewayv2_api.fastfood_api.id
}

output "env_file" {
  description = "Arquivo .env para testes"
  value       = "API_URL=${aws_apigatewayv2_api.fastfood_api.api_endpoint}/auth"
}