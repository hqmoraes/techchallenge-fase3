provider "aws" {
  region = var.region
}

# Módulo VPC para criar a infraestrutura de rede do EKS
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"
  
  name = "${var.project_name}-vpc"
  cidr = var.vpc_cidr
  
  azs             = ["${var.region}a", "${var.region}b"]
  private_subnets = [] # Removendo subnets privadas para economizar
  public_subnets  = var.public_subnets
  
  enable_nat_gateway = false # NAT Gateway é caro, usaremos apenas subnets públicas
  single_nat_gateway = false
  
  # Tags necessárias para que o EKS descubra as subnets
  public_subnet_tags = {
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
    "kubernetes.io/role/elb"                    = "1"
  }
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# Módulo EKS para criar o cluster Kubernetes
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.15.3"
  
  cluster_name    = var.cluster_name
  cluster_version = var.cluster_version
  
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.public_subnets # Usando subnets públicas para os nós também
  
  # Configurações do cluster
  cluster_endpoint_public_access = true
  cluster_endpoint_public_access_cidrs = ["0.0.0.0/0"]

  # Configurações de segurança
  cluster_security_group_additional_rules = {
    ingress_https_world = {
      description      = "HTTPS from approved IPs"
      protocol         = "tcp"
      from_port        = 443
      to_port          = 443
      type             = "ingress"
      cidr_blocks      = ["0.0.0.0/0"]
    }
  }

  # Configuração dos grupos de nós gerenciados
  eks_managed_node_groups = {
    main = {
      min_size       = var.node_group_min_size
      max_size       = var.node_group_max_size
      desired_size   = var.node_group_desired_size
      instance_types = var.node_instance_types
      
      # Corrigir a política para o nome correto
      iam_role_additional_policies = {
        AmazonECR-ReadOnly = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
      }
      
      # Colocar os nós em subnets públicas
      subnet_ids = module.vpc.public_subnets
    }
  }
  
  # Configuração de autenticação e acesso ao cluster
  manage_aws_auth_configmap = true
  aws_auth_roles = concat(var.additional_roles_for_eks_auth, [
    {
      rolearn  = "arn:aws:iam::691780621308:role/aws-reserved/sso.amazonaws.com/AWSReservedSSO_AWSAdministratorAccess_5ae8c56b0775c1b9"
      username = "sso-admin"
      groups   = ["system:masters"]
    },
    {
      rolearn  = module.eks.eks_managed_node_groups["main"].iam_role_arn
      username = "system:node:{{EC2PrivateDNSName}}"
      groups   = ["system:bootstrappers", "system:nodes"]
    }
  ])
  
  aws_auth_users = concat(var.additional_users_for_eks_auth, [
    {
      userarn  = "arn:aws:sso:::permissionSet/ssoins-722330551179ab0f/ps-c86b787cf7759ce8"
      username = "sso-permission-set-users"
      groups   = ["system:masters"]
    }
  ])
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}


# Configuração completa do módulo ECR
module "ecr" {
  source = "./ecr"
  
  project_name   = var.project_name
  environment    = var.environment
  aws_account_id = var.aws_account_id
  region         = var.region
}






