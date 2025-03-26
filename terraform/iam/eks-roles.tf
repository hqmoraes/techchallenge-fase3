resource "aws_iam_role" "eks_service_account" {
  name = "eks-service-account-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::${var.aws_account_id}:oidc-provider/${var.eks_oidc_provider}"
        }
        Condition = {
          StringEquals = {
            "${var.eks_oidc_provider}:sub": "system:serviceaccount:fastfood:fastfood-app"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_dynamodb" {
  role       = aws_iam_role.eks_service_account.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

# filepath: /mnt/c/Users/henri/OneDrive/Documentos/FIAP/project3/terraform/iam/lambda-role.tf
resource "aws_iam_role" "lambda_auth_role" {
  name = "lambda-auth-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb" {
  role       = aws_iam_role.lambda_auth_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess"
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_auth_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}