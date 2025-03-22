# AWS Secrets Manager para o Tech Challenge Fast Food - Fase 3

# Timestamp para nomes únicos
locals {
  timestamp = formatdate("YYYYMMDDhhmmss", timestamp())
  db_secret_name = "${var.project_name}-${var.environment}-database-${local.timestamp}"
  api_secret_name = "${var.project_name}-${var.environment}-api-${local.timestamp}"
}

resource "aws_secretsmanager_secret" "database_credentials" {
  name        = local.db_secret_name
  description = "Credenciais para acesso ao DynamoDB do Tech Challenge Fast Food"
  recovery_window_in_days = 0  # Desabilitar período de recuperação
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
    CreatedAt   = local.timestamp
  }
}

resource "aws_secretsmanager_secret_version" "database_credentials" {
  secret_id     = aws_secretsmanager_secret.database_credentials.id
  secret_string = jsonencode({
    region           = var.aws_region
    clients_table    = aws_dynamodb_table.fast_food_clients.name
    products_table   = aws_dynamodb_table.fast_food_products.name
    categories_table = aws_dynamodb_table.fast_food_categories.name
    orders_table     = aws_dynamodb_table.fast_food_orders.name
    payments_table   = aws_dynamodb_table.fast_food_payments.name
    created_at       = local.timestamp
  })
}

resource "aws_secretsmanager_secret" "api_credentials" {
  name        = local.api_secret_name
  description = "Credenciais para APIs externas do Tech Challenge Fast Food"
  recovery_window_in_days = 0  # Desabilitar período de recuperação
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
    CreatedAt   = local.timestamp
  }
}

resource "aws_secretsmanager_secret_version" "api_credentials" {
  secret_id     = aws_secretsmanager_secret.api_credentials.id
  secret_string = jsonencode({
    mercado_pago_token = var.mercado_pago_token,
    jwt_secret         = var.jwt_secret,
    created_at         = local.timestamp
  })
}

# Outputs para uso em outros módulos
output "database_secret_arn" {
  value = aws_secretsmanager_secret.database_credentials.arn
  description = "ARN da secret de credenciais do banco de dados"
}

output "database_secret_name" {
  value = aws_secretsmanager_secret.database_credentials.name
  description = "Nome da secret de credenciais do banco de dados"
}

output "api_secret_arn" {
  value = aws_secretsmanager_secret.api_credentials.arn
  description = "ARN da secret de credenciais de API"
}

output "api_secret_name" {
  value = aws_secretsmanager_secret.api_credentials.name
  description = "Nome da secret de credenciais de API"
}

# Secret para o módulo Database com proteção contra exclusão
resource "aws_secretsmanager_secret" "database_protected" {
  name                    = "fast-food/database/credentials"
  description             = "Credenciais protegidas do DynamoDB para Tech Challenge Fast Food"
  recovery_window_in_days = 0  # Sem período de recuperação, exclusão imediata
  
  tags = {
    Environment = var.environment
    Project     = "fast-food-tech-challenge"
    Module      = "database"
  }
}

# Versão inicial da secret
resource "aws_secretsmanager_secret_version" "database_protected" {
  secret_id     = aws_secretsmanager_secret.database_protected.id
  secret_string = jsonencode({
    region           = var.aws_region
    clients_table    = aws_dynamodb_table.fast_food_clients.name
    products_table   = aws_dynamodb_table.fast_food_products.name
    categories_table = aws_dynamodb_table.fast_food_categories.name
    orders_table     = aws_dynamodb_table.fast_food_orders.name
    payments_table   = aws_dynamodb_table.fast_food_payments.name
  })
}

# Secret para o módulo API com proteção contra exclusão
resource "aws_secretsmanager_secret" "api_protected" {
  name                    = "fast-food/api/credentials"
  description             = "Credenciais protegidas para APIs externas do Tech Challenge Fast Food"
  recovery_window_in_days = 0
  
  tags = {
    Environment = var.environment
    Project     = "fast-food-tech-challenge"
    Module      = "api"
  }
}

# Versão inicial da secret da API
resource "aws_secretsmanager_secret_version" "api_protected" {
  secret_id     = aws_secretsmanager_secret.api_protected.id
  secret_string = jsonencode({
    mercado_pago_token = var.mercado_pago_token,
    jwt_secret         = var.jwt_secret
  })
}

# Lambda Function para gerenciar a rotação de secrets
resource "aws_lambda_function" "secret_rotation_lambda" {
  function_name = "fast-food-secret-rotation"
  role          = aws_iam_role.secret_rotation_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  timeout       = 60
  
  # Código do Lambda empacotado como arquivo zip
  filename      = "${path.module}/lambda/secret-rotation.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda/secret-rotation.zip")
  
  environment {
    variables = {
      DYNAMODB_TABLE_PREFIX = var.environment
    }
  }
}

# Política para o Lambda acessar e atualizar as secrets
resource "aws_iam_policy" "secret_rotation_policy" {
  name        = "fast-food-secret-rotation-policy"
  description = "Permite ao Lambda rotacionar as secrets do Tech Challenge Fast Food"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:DescribeSecret",
          "secretsmanager:GetSecretValue",
          "secretsmanager:PutSecretValue",
          "secretsmanager:UpdateSecretVersionStage"
        ]
        Resource = [
          aws_secretsmanager_secret.database_protected.arn,
          aws_secretsmanager_secret.api_protected.arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# Anexar política ao role do Lambda
resource "aws_iam_role_policy_attachment" "secret_rotation_attachment" {
  role       = aws_iam_role.secret_rotation_role.name
  policy_arn = aws_iam_policy.secret_rotation_policy.arn
}

# Outputs das secrets protegidas
output "database_protected_secret_arn" {
  value = aws_secretsmanager_secret.database_protected.arn
  description = "ARN da secret protegida do database"
}

output "api_protected_secret_arn" {
  value = aws_secretsmanager_secret.api_protected.arn
  description = "ARN da secret protegida da API"
}
