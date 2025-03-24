provider "aws" {
  region = var.region
}

# Módulo VPC para criar a infraestrutura de rede do EKS - SIMPLIFICADO
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"
  
  name = "${var.project_name}-vpc"
  cidr = var.vpc_cidr
  
  azs             = ["${var.region}a", "${var.region}b"]
  private_subnets = []  # Removido subnets privadas
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]  # Added default subnets
  
  # Adicionar esta configuração para atribuir IPs públicos automaticamente
  map_public_ip_on_launch = true
  
  enable_nat_gateway = false
  single_nat_gateway = false
  
  # Tags necessárias para que o EKS descubra as subnets
  public_subnet_tags = {
    "kubernetes.io/cluster/${var.eks_cluster_name}" = "shared"
    "kubernetes.io/role/elb"                    = "1"
  }
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# IAM Roles para o EKS
resource "aws_iam_role" "eks_cluster_role" {
  name = "${var.project_name}-eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

# Role para os nodes do EKS
resource "aws_iam_role" "eks_node_role" {
  name = "${var.project_name}-eks-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_worker_node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "eks_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "ecr_read_only" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_node_role.name
}

# Grupo de segurança para o EKS
resource "aws_security_group" "eks_cluster_sg" {
  name        = "${var.project_name}-eks-sg"
  description = "Security group for EKS cluster"
  vpc_id      = module.vpc.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow incoming HTTPS traffic"
  }

  tags = {
    Name = "${var.project_name}-eks-sg"
  }
}

# Usando o EKS como recurso direto
resource "aws_eks_cluster" "fastfood" {
  name     = var.eks_cluster_name
  role_arn = aws_iam_role.eks_cluster_role.arn
  version  = "1.28"  # Added default version

  vpc_config {
    subnet_ids = module.vpc.public_subnets  # Usando apenas subnets públicas
    endpoint_private_access = false  # Desabilitado para economizar
    endpoint_public_access  = true
    security_group_ids      = [aws_security_group.eks_cluster_sg.id]
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy
  ]
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# Node Group - ALTERADO PARA USAR SUBNETS PÚBLICAS
resource "aws_eks_node_group" "fastfood" {
  cluster_name    = aws_eks_cluster.fastfood.name
  node_group_name = "${var.project_name}-node-group"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = module.vpc.public_subnets  # Alterado para public_subnets
  
  scaling_config {
    desired_size = var.node_group_desired_capacity
    max_size     = var.node_group_max_size
    min_size     = var.node_group_min_size
  }
  
  instance_types = ["t3.medium"]  # Added default instance type

  # Removed the SSH key reference that was causing the error

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.ecr_read_only,
  ]
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# Provider Kubernetes configurado para o cluster EKS
provider "kubernetes" {
  host                   = aws_eks_cluster.fastfood.endpoint
  cluster_ca_certificate = base64decode(aws_eks_cluster.fastfood.certificate_authority.0.data)
  
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args        = ["eks", "get-token", "--cluster-name", aws_eks_cluster.fastfood.name]
  }
}

# Ativar o gerenciamento do ConfigMap aws-auth
resource "kubernetes_config_map_v1_data" "aws_auth" {
  metadata {
    name      = "aws-auth"
    namespace = "kube-system"
  }

  force = true

  data = {
    mapRoles = yamlencode(concat(
      [
        {
          rolearn  = aws_iam_role.eks_node_role.arn
          username = "system:node:{{EC2PrivateDNSName}}"
          groups   = ["system:bootstrappers", "system:nodes"]
        },
        {
          # Role do AWS IAM Identity Center (SSO)
          rolearn  = "arn:aws:iam::691780621308:role/aws-reserved/sso.amazonaws.com/AWSReservedSSO_AWSAdministratorAccess_5ae8c56b0775c1b9"
          username = "sso-admin"
          groups   = ["system:masters"]
        }
      ],
      var.additional_roles_for_eks_auth
    ))

    mapUsers = yamlencode(concat(
      var.additional_users_for_eks_auth,
      [
        {
          userarn  = "arn:aws:sso:::permissionSet/ssoins-722330551179ab0f/ps-c86b787cf7759ce8"
          username = "sso-permission-set-users"
          groups   = ["system:masters"]
        }
      ]
    ))
  }

  depends_on = [
    aws_eks_cluster.fastfood,
    aws_eks_node_group.fastfood
  ]
}

# ECR Repository para armazenar as imagens da aplicação
module "ecr" {
  source = "./ecr"
  environment = "dev"
  project_name = "techchallenge_fase_3"

}






