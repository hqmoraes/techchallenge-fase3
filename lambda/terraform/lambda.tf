// lambda/terraform/lambda.tf
# Função Lambda para autenticação
resource "aws_lambda_function" "auth_function" {
  filename      = "${path.module}/lambda-package.zip"
  function_name = "${var.environment}-fastfood-auth"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  timeout       = 10
  memory_size   = 256
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

}

# Outras configurações Lambda...

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../src"  # Diretório do código fonte
  excludes    = ["terraform", ".git", "*.zip", "tests"]
  output_path = "${path.module}/lambda-package.zip"
}

resource "aws_iam_role" "lambda_role" {
  name = "${var.environment}-fastfood-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}