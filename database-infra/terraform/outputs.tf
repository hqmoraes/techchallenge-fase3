output "clients_table_name" {
  description = "Nome da tabela de clientes"
  value       = aws_dynamodb_table.fast_food_clients.name
}

output "clients_table_arn" {
  description = "ARN da tabela de clientes"
  value       = aws_dynamodb_table.fast_food_clients.arn
}

output "products_table_name" {
  description = "Nome da tabela de produtos"
  value       = aws_dynamodb_table.fast_food_products.name
}

output "products_table_arn" {
  description = "ARN da tabela de produtos"
  value       = aws_dynamodb_table.fast_food_products.arn
}

output "orders_table_name" {
  description = "Nome da tabela de pedidos"
  value       = aws_dynamodb_table.fast_food_orders.name
}

output "orders_table_arn" {
  description = "ARN da tabela de pedidos"
  value       = aws_dynamodb_table.fast_food_orders.arn
}

output "payments_table_name" {
  description = "Nome da tabela de pagamentos" 
  value       = aws_dynamodb_table.fast_food_payments.name
}

output "payments_table_arn" {
  description = "ARN da tabela de pagamentos"
  value       = aws_dynamodb_table.fast_food_payments.arn
}
output "categories_table_arn" {
  description = "ARN da tabela categories"
  value       = aws_dynamodb_table.fast_food_categories.arn
}


