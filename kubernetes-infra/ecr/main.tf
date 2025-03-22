resource "aws_ecr_repository" "fastfood_app" {
  # Usar variáveis para definir o nome do repositório
  name                 = "${var.project_name}-app-${var.environment}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  # Habilitar encriptação para atender os requisitos de segurança
  encryption_configuration {
    encryption_type = "AES256"
  }

  # Tags para rastreabilidade
  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# Política de lifecycle para manter apenas as últimas N imagens
resource "aws_ecr_lifecycle_policy" "fastfood_app_lifecycle" {
  repository = aws_ecr_repository.fastfood_app.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 10 images"
        selection = {
          tagStatus     = "any"
          countType     = "imageCountMoreThan"
          countNumber   = 10
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# Política de repositório para acesso seguro
resource "aws_ecr_repository_policy" "fastfood_app_policy" {
  repository = aws_ecr_repository.fastfood_app.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowPullPushFromAccount"
        Effect = "Allow"
        Principal = {
          "AWS" = "arn:aws:iam::${local.account_id}:root"
        }
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:ListImages"
        ]
      }
    ]
  })
}