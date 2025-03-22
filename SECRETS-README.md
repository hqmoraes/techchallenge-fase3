# Gerenciamento de Credenciais - Fast Food Tech Challenge

## Visão Geral

Este projeto implementa AWS Secrets Manager e IAM Roles for Service Accounts (IRSA) para gerenciar credenciais de forma segura, conforme exigido pelas diretivas do Tech Challenge Fase 3.

## AWS Secrets Manager

O AWS Secrets Manager armazena:
- Credenciais do DynamoDB (nomes das tabelas, região)
- Credenciais de APIs externas (tokens de pagamento, segredos JWT)

## IAM Roles for Service Accounts (IRSA)

IRSA permite que pods Kubernetes assumam IAM roles específicas, eliminando a necessidade de credenciais hardcoded.

### Como Funciona

1. O cluster EKS é configurado com um OIDC Provider
2. Service Accounts são anotados com ARNs de IAM Roles
3. Pods que usam esses Service Accounts recebem automaticamente permissões AWS

## Configuração Local

Para desenvolvimento local:

1. Crie um arquivo `terraform.tfvars` baseado no exemplo:
   ```bash
   cp database-infra/terraform/example.tfvars database-infra/terraform/terraform.tfvars
   ```

2. Edite com suas credenciais:
   ```bash
   nano database-infra/terraform/terraform.tfvars
   ```

3. **IMPORTANTE**: Nunca comite arquivos `terraform.tfvars` ao repositório!

## Estrutura do Projeto

- `database-infra/terraform/secrets.tf`: Definição dos secrets no AWS Secrets Manager
- `kubernetes-infra/terraform/irsa.tf`: Configuração de IRSA para o cluster EKS
- `kubernetes-app/manifests/service-accounts.yaml`: Service Accounts com anotações IRSA
- `kubernetes-app/src/utils/secrets.js`: Utilitário para acesso a secrets via AWS SDK

## Fluxo de Implantação

1. Implante a infraestrutura de banco de dados:
   ```bash
   cd database-infra/terraform
   terraform apply
   ```

2. Implante a infraestrutura Kubernetes com IRSA:
   ```bash
   cd kubernetes-infra/terraform
   terraform apply
   ```

3. Aplique as configurações nos manifestos Kubernetes:
   ```bash
   ./scripts/apply-k8s-secrets.sh
   ```

## Segurança

- As IAM Roles seguem o princípio do privilégio mínimo
- Todas as credenciais são armazenadas no AWS Secrets Manager
- Os pods não têm credenciais AWS hardcoded
- O .gitignore evita o commit acidental de credenciais

## Referências

- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [IAM Roles for Service Accounts](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html)
- [EKS Pod Identity](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html)
