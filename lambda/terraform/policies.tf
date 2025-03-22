# Política de acesso ao DynamoDB para a função Lambda
resource "aws_iam_policy" "dynamodb_policy" {
  name        = "${var.environment}-lambda-dynamodb-policy"
  description = "Política que permite acesso do Lambda ao DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "dynamodb:GetItem",
          "dynamodb:BatchGetItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ],
        Effect   = "Allow",
        Resource = var.dynamodb_table_arn != "" ? [var.dynamodb_table_arn] : ["*"]
      }
    ]
  })

  tags = merge(var.tags, {
    Service = "Authentication"
  })
}

# Política para logs do CloudWatch
resource "aws_iam_policy" "lambda_logging" {
  name        = "${var.environment}-lambda-logging-policy"
  description = "Política que permite que o Lambda escreva logs no CloudWatch"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Effect   = "Allow",
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })

  tags = merge(var.tags, {
    Service = "Logging"
  })
}

# Attachment da política de logging
resource "aws_iam_role_policy_attachment" "lambda_logging_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}