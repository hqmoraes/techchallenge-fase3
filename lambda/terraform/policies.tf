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

