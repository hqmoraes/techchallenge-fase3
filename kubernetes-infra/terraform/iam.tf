# Configuração para IAM Roles for Service Accounts (IRSA) e Políticas
# Integração entre EKS, DynamoDB e Kubernetes Secrets

# Obter informações do cluster EKS
data "aws_eks_cluster" "cluster" {
  name       = var.cluster_name
  depends_on = [aws_eks_cluster.fastfood]
}

# Criar o OIDC Provider para IRSA
data "tls_certificate" "eks" {
  url = data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer
  depends_on = [data.aws_eks_cluster.cluster]
}

resource "aws_iam_openid_connect_provider" "eks" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.eks.certificates[0].sha1_fingerprint]
  url             = data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer
  
  tags = {
    Name        = "${var.project_name}-eks-oidc"
    Environment = var.environment
    Project     = var.project_name
  }
  
  depends_on = [data.tls_certificate.eks]
}

# IAM Role para o ServiceAccount da aplicação
resource "aws_iam_role" "app_role" {
  name = "${var.project_name}-app-role"

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
            "${replace(data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer, "https://", "")}:sub": "system:serviceaccount:${var.eks_namespace}:fastfood-app"
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

# Política para acesso ao DynamoDB
resource "aws_iam_policy" "dynamodb_access" {
  name        = "${var.project_name}-dynamodb-access-policy"
  description = "Permite acesso ao DynamoDB para a aplicação Fast Food"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:DeleteItem",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:UpdateItem"
        ]
        Resource = var.dynamodb_table_arn != "" ? [var.dynamodb_table_arn] : ["*"]
      }
    ]
  })

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# Anexar política ao role da aplicação
resource "aws_iam_role_policy_attachment" "app_dynamodb_attachment" {
  role       = aws_iam_role.app_role.name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}

# IAM Role para acesso ao DynamoDB
resource "aws_iam_role" "dynamodb_role" {
  name = "${var.project_name}-dynamodb-role"

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
            "${replace(data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer, "https://", "")}:sub": "system:serviceaccount:${var.eks_namespace}:dynamodb-sa"
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

# Anexar política ao role do DynamoDB
resource "aws_iam_role_policy_attachment" "dynamodb_attachment" {
  role       = aws_iam_role.dynamodb_role.name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}

# IAM Role para acesso a secrets
resource "aws_iam_role" "secrets_role" {
  name = "${var.project_name}-secrets-role"

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
            "${replace(data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer, "https://", "")}:sub": "system:serviceaccount:${var.eks_namespace}:secrets-sa"
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

# Política para acesso a secrets
resource "aws_iam_policy" "secrets_access" {
  name        = "${var.project_name}-secrets-access-policy"
  description = "Permite acesso a Secrets do Kubernetes"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = "*"
      }
    ]
  })
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# Anexar política ao role de secrets
resource "aws_iam_role_policy_attachment" "secrets_attachment" {
  role       = aws_iam_role.secrets_role.name
  policy_arn = aws_iam_policy.secrets_access.arn
}

# Outputs para uso em scripts de deploy
output "app_role_arn" {
  value       = aws_iam_role.app_role.arn
  description = "ARN do IAM Role para a aplicação Fast Food"
}

output "dynamodb_role_arn" {
  value       = aws_iam_role.dynamodb_role.arn
  description = "ARN do IAM Role para acesso ao DynamoDB"
}

output "secrets_role_arn" {
  value       = aws_iam_role.secrets_role.arn
  description = "ARN do IAM Role para acesso a Secrets"
}