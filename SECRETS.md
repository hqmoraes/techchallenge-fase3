# Gerenciamento de Credenciais no Tech Challenge Fast Food

Este documento descreve como as credenciais e segredos são gerenciados de forma segura no projeto Tech Challenge Fast Food Fase 3, utilizando AWS Secrets Manager e IAM Roles for Service Accounts (IRSA).

## AWS Secrets Manager

O AWS Secrets Manager é um serviço que permite armazenar e recuperar credenciais de forma segura, com criptografia, controle de acesso, rotação automática e auditoria.

### Secrets Configurados

1. **Database Credentials** - Contém informações sobre tabelas do DynamoDB:
   - Nome das tabelas
   - Região
   - Outras configurações de banco de dados

2. **External API Credentials** - Contém credenciais para APIs externas:
   - Tokens de acesso para o Mercado Pago
   - Segredos para JWT

## IAM Roles for Service Accounts (IRSA)

IRSA permite que pods Kubernetes assumam IAM roles AWS específicas usando service accounts, eliminando a necessidade de armazenar credenciais AWS dentro dos pods.

### Service Accounts Configurados

1. **fastfood-app-sa** - Service account para a aplicação principal:
   - Acesso ao DynamoDB
   - Permissões mínimas necessárias

2. **fastfood-secrets-sa** - Service account para acesso a secrets:
   - Acesso ao AWS Secrets Manager
   - Limitado apenas aos secrets necessários

## Como Funciona

1. **Armazenamento de Secrets**:
   - Secrets são criados pelo Terraform no AWS Secrets Manager
   - Valores sensíveis são definidos em arquivos `terraform.tfvars` (não comitados)

2. **Acesso a Secrets**:
   - Pods usam service accounts com annotations IRSA
   - O AWS SDK usa automaticamente a IAM role associada
   - Não é necessário armazenar credenciais AWS nos pods

3. **Fluxo de Acesso**:
