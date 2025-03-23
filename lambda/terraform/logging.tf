# lambda/terraform/logging.tf
data "aws_cloudwatch_log_group" "existing" {
  count = 1
  name  = "/aws/lambda/${aws_lambda_function.auth_function.function_name}"
}

resource "aws_cloudwatch_log_group" "lambda_logs" {
  count             = length(data.aws_cloudwatch_log_group.existing) > 0 ? 0 : 1
  name              = "/aws/lambda/${aws_lambda_function.auth_function.function_name}"
  retention_in_days = 14

  tags = {
    Environment = var.environment
    Project     = "FastFood"
  }
}

# Configuração de logs para funções Lambda do microsserviço de autenticação
# Este arquivo implementa requisitos de observabilidade conforme as diretivas

# Grupo de logs para a função Lambda de autenticação
resource "aws_cloudwatch_log_group" "auth_lambda_logs" {
  name              = "/aws/lambda/${var.environment}-fastfood-auth"
  retention_in_days = 14
  
  tags = merge(var.tags, {
    Service = "Authentication"
  })
}

# Política para permissões de logging
resource "aws_iam_policy" "lambda_logging" {
  name        = "${var.environment}-lambda-logging-policy"
  path        = "/"
  description = "IAM policy for logging from Lambda functions"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams"
      ]
      Resource = "arn:aws:logs:*:*:*"
      Effect   = "Allow"
    }]
  })
  
  # Evitar conflitos na criação/atualização da política
  lifecycle {
    create_before_destroy = true
  }
}

# Anexar a política de logging ao papel IAM do Lambda
resource "aws_iam_role_policy_attachment" "lambda_logging_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_logging.arn
  
  depends_on = [
    aws_iam_policy.lambda_logging,
    aws_iam_role.lambda_role
  ]
}