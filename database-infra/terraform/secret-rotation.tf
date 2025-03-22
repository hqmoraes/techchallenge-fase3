# Configuração da função Lambda para rotação de secrets
resource "aws_lambda_function" "secret_rotation" {
  function_name = "${var.project_name}-secret-rotation-${var.environment}"
  filename      = "${path.module}/lambda/secret-rotation.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda/secret-rotation.zip")
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  timeout       = 30
  memory_size   = 128
  
  role = aws_iam_role.secret_rotation_role.arn

  environment {
    variables = {
      ENVIRONMENT = var.environment
      PROJECT_NAME = var.project_name
    }
  }

  # Importante: dependência para garantir que o pacote será criado
  depends_on = [
    null_resource.ensure_lambda_package
  ]
}

# IAM Role para a função Lambda
resource "aws_iam_role" "secret_rotation_role" {
  name = "${var.project_name}-secret-rotation-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Política para permitir que o Lambda gere logs
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.secret_rotation_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Política personalizada para acesso às secrets
resource "aws_iam_policy" "secret_access" {
  name        = "${var.project_name}-secret-access-policy-${var.environment}"
  description = "Permitir que o Lambda acesse e atualize secrets no AWS Secrets Manager"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Action = [
        "secretsmanager:DescribeSecret",
        "secretsmanager:GetSecretValue",
        "secretsmanager:PutSecretValue",
        "secretsmanager:UpdateSecretVersionStage"
      ],
      Resource = [
        aws_secretsmanager_secret.database_credentials.arn,
        aws_secretsmanager_secret.api_credentials.arn
      ]
    }]
  })
}

# Anexar política de acesso a secrets ao role do Lambda
resource "aws_iam_role_policy_attachment" "secret_policy" {
  role       = aws_iam_role.secret_rotation_role.name
  policy_arn = aws_iam_policy.secret_access.arn
}

# Permitir que o Secrets Manager invoque o Lambda
resource "aws_lambda_permission" "allow_secrets_manager" {
  statement_id  = "AllowExecutionFromSecretsManager"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.secret_rotation.function_name
  principal     = "secretsmanager.amazonaws.com"
}

# Configurar rotação automática para a secret do banco de dados
resource "aws_secretsmanager_secret_rotation" "database_rotation" {
  secret_id           = aws_secretsmanager_secret.database_credentials.id
  rotation_lambda_arn = aws_lambda_function.secret_rotation.arn
  
  rotation_rules {
    automatically_after_days = 60  # Rotação a cada 60 dias
  }
  
  # Importante: dependência para garantir que a permissão foi configurada
  depends_on = [aws_lambda_permission.allow_secrets_manager]
}

# Configurar rotação automática para a secret de APIs
resource "aws_secretsmanager_secret_rotation" "api_rotation" {
  secret_id           = aws_secretsmanager_secret.api_credentials.id
  rotation_lambda_arn = aws_lambda_function.secret_rotation.arn
  
  rotation_rules {
    automatically_after_days = 60  # Rotação a cada 60 dias
  }
  
  # Importante: dependência para garantir que a permissão foi configurada
  depends_on = [aws_lambda_permission.allow_secrets_manager]
}

# Recurso para garantir que o pacote Lambda existe
resource "null_resource" "ensure_lambda_package" {
  # Trigger sempre que o conteúdo do pacote mudar ou o script for alterado
  triggers = {
    script_hash = filesha256("${path.module}/lambda/package.sh")
    index_hash  = fileexists("${path.module}/lambda/index.js") ? filesha256("${path.module}/lambda/index.js") : "new_file"
  }

  # Este resource apenas existe para garantir a dependência e não executa nenhuma ação
  # A execução real do script é feita no deploy-all.sh antes do terraform apply
}