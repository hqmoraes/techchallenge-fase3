# Configuração IAM para acesso Lambda

# IAM Role para que o EKS possa invocar funções Lambda
resource "aws_iam_role" "lambda_invoker_role" {
  name = "${var.project_name}-lambda-invoker-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.eks.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${replace(data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer, "https://", "")}:sub": "system:serviceaccount:${var.eks_namespace}:lambda-sa"
          }
        }
      }
    ]
  })
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
  
  depends_on = [aws_iam_openid_connect_provider.eks]
}

# Política para permitir invocação de Lambda
resource "aws_iam_policy" "lambda_invoke_policy" {
  name        = "${var.project_name}-lambda-invoke-policy"
  description = "Permite invocar funções Lambda específicas"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction",
          "lambda:GetFunction"
        ]
        Resource = var.lambda_auth_arn != "" ? [var.lambda_auth_arn] : ["*"]
      }
    ]
  })

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# Anexar política ao role
resource "aws_iam_role_policy_attachment" "lambda_invoke_attachment" {
  role       = aws_iam_role.lambda_invoker_role.name
  policy_arn = aws_iam_policy.lambda_invoke_policy.arn
}

# Output para uso em scripts
output "lambda_role_arn" {
  value       = aws_iam_role.lambda_invoker_role.arn
  description = "ARN do IAM Role para invocar funções Lambda"
}