# Grupo de logs do CloudWatch para a função Lambda
resource "aws_cloudwatch_log_group" "auth_lambda_logs" {
  name              = "/aws/lambda/${var.environment}-fastfood-auth"
  retention_in_days = 14

  tags = merge(var.tags, {
    Service = "Authentication"
  })
}