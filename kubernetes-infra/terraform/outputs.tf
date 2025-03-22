output "cluster_name" {
  description = "Nome do cluster EKS"
  value       = "${var.project_name}-${var.environment}"
}

output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = aws_eks_cluster.fastfood.endpoint
}

output "cluster_security_group_id" {
  description = "ID do grupo de segurança criado para o cluster EKS"
  value       = module.eks.cluster_security_group_id
}

output "kubectl_config" {
  description = "Comando para configurar kubectl"
  value       = "aws eks update-kubeconfig --name ${module.eks.cluster_name} --region ${var.aws_region}"
}

output "kubeconfig_certificate_authority_data" {
  description = "Base64 encoded certificate data required to communicate with the cluster"
  value       = aws_eks_cluster.fastfood.certificate_authority[0].data
}

output "node_group_id" {
  description = "EKS node group ID"
  value       = aws_eks_node_group.fastfood.id
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
}