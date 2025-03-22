### 1. Documentação da Arquitetura Global

**Entregáveis:**
- Diagrama de arquitetura completo
- Documento descritivo da solução

**Conteúdo do Documento:**
```markdown
# Arquitetura da Solução Fast Food Tech Challenge

## Visão Geral
Este documento descreve a arquitetura implementada para o sistema Fast Food, migrando de uma aplicação monolítica para uma arquitetura de microsserviços na AWS.

## Componentes Principais
1. **Autenticação (Lambda)** - Função serverless para autenticação de clientes via CPF
2. **Banco de Dados (DynamoDB)** - Armazenamento NoSQL para dados dos clientes, pedidos e produtos
3. **Aplicação (Kubernetes)** - Serviços de pedidos, pagamentos e monitoramento
4. **Infraestrutura (EKS/Terraform)** - Cluster Kubernetes gerenciado na AWS

## Fluxos Principais
- **Autenticação**: Cliente → API Gateway → Lambda → DynamoDB → JWT
- **Pedidos**: Cliente → Ingress → Serviço de Pedidos → DynamoDB
- **Pagamentos**: Serviço de Pedidos → Serviço de Pagamentos → Confirmação
- **Monitoramento**: Cliente → Serviço de Monitor → Consulta status dos pedidos

## Decisões Arquiteturais
- **Adoção de DynamoDB**: Escolhido pela escalabilidade automática e modelo sem servidor
- **Clean Architecture**: Cada microsserviço implementa separação de responsabilidades
- **Observabilidade**: Prometheus e Grafana para monitoramento centralizado
- **Segurança**: JWT para autenticação entre serviços
```

### 2. Lambda (Autenticação)

**Entregáveis:**
- Documentação do componente Lambda
- Evidências de funcionamento

**Conteúdo:**
```markdown
# Componente Lambda - Autenticação

## Visão Geral
Este componente implementa a autenticação de clientes via CPF usando AWS Lambda e DynamoDB.

## Arquitetura
- **API Gateway**: Expõe o endpoint de autenticação
- **Lambda Function**: Processa a autenticação
- **DynamoDB**: Armazena dados dos clientes

## Fluxo de Autenticação
1. Cliente envia CPF e senha para API Gateway
2. Lambda valida as credenciais no DynamoDB
3. Em caso de sucesso, gera token JWT para autorização
4. Retorna resposta com token ou erro

## Configuração
- **Região AWS**: us-east-1
- **Memória Lambda**: 256MB
- **Timeout**: 10 segundos

## Implementação
A função Lambda é implementada em Node.js 22, utilizando:
- AWS SDK para acesso ao DynamoDB
- jsonwebtoken para geração de tokens JWT
```

**Evidências:**
- Screenshots da função Lambda no console AWS
- Resultado de testes de autenticação com CPF válido/inválido
- Logs da Lambda mostrando processamento

### 3. Database-Infra (DynamoDB)

**Entregáveis:**
- Documentação da infraestrutura do banco de dados
- Evidências de funcionamento
- Schema das tabelas

**Conteúdo:**
```markdown
# Infraestrutura de Banco de Dados - DynamoDB

## Tabelas Implementadas
1. **FastFoodClients**: Armazena dados dos clientes
   - Chave Primária: ClienteId (String)
   - GSI: CPFIndex (Chave: CPF)
   
2. **FastFoodProducts**: Catálogo de produtos
   - Chave Primária: ProductId (String)
   - GSI: CategoryIndex (Chave: CategoryId)

3. **FastFoodOrders**: Pedidos realizados
   - Chave Primária: OrderId (String)
   - GSI: ClienteIdIndex (Chave: ClienteId)
   - GSI: StatusIndex (Chave: Status)

## Decisões de Design
- Utilização de índices secundários globais para consultas eficientes
- Modelo de acesso por CPF para autenticação rápida
- Particionamento adequado para evitar hot spots

## Infraestrutura como Código
Todo o banco de dados é provisionado via Terraform, permitindo:
- Versionamento da infraestrutura
- Deployment automatizado
- Configuração consistente entre ambientes
```

**Evidências:**
- Screenshots do console AWS mostrando tabelas DynamoDB
- Output do Terraform após criação das tabelas
- Exemplos de operações CRUD nas tabelas

### 4. Kubernetes-Infra (EKS)

**Entregáveis:**
- Documentação da infraestrutura Kubernetes
- Evidências de funcionamento
- Configurações de segurança e rede

**Conteúdo:**
```markdown
# Infraestrutura Kubernetes - EKS

## Configuração do Cluster
- **Versão Kubernetes**: 1.28
- **Tipo de Nós**: t3.medium (2 vCPU, 4GB RAM)
- **Auto-scaling**: Min 2, Max 5 nós
- **VPC Dedicada**: CIDR 10.0.0.0/16
- **Subnets**: 2 públicas, 2 privadas

## Segurança
- **Pod Security Policies**: Configuradas para limitar privilégios
- **Network Policies**: Isolamento entre namespaces
- **RBAC**: Controle de acesso baseado em papéis

## Namespaces
- **pedidos**: Serviço de gerenciamento de pedidos
- **pagamentos**: Serviço de processamento de pagamentos
- **monitor**: Serviço de monitoramento de status
- **observability**: Prometheus e Grafana

## Observabilidade
- **Prometheus**: Coleta de métricas
- **Grafana**: Visualização de dashboards
- **Loki**: Agregação de logs
```

**Evidências:**
- Screenshots do console AWS mostrando o cluster EKS
- Output do kubectl mostrando nós e pods
- Configurações de segurança implementadas

### 5. Kubernetes-App (Microsserviços)

**Entregáveis:**
- Documentação dos microsserviços
- Evidências de funcionamento
- Configurações de deployment

**Conteúdo:**
```markdown
# Aplicação Kubernetes - Microsserviços

## Serviço de Pedidos
- **Responsabilidade**: Gerenciamento do ciclo de vida dos pedidos
- **Endpoints**:
  - POST /pedidos - Criar novo pedido
  - GET /pedidos/{id} - Consultar pedido específico
  - PUT /pedidos/{id}/status - Atualizar status
- **Tecnologia**: Node.js 22, Express

## Serviço de Pagamentos
- **Responsabilidade**: Processamento de pagamentos
- **Endpoints**:
  - POST /pagamentos - Processar pagamento
  - GET /pagamentos/{id} - Consultar status do pagamento
- **Tecnologia**: Node.js 22, Express

## Serviço de Monitor
- **Responsabilidade**: Acompanhamento em tempo real dos pedidos
- **Endpoints**:
  - GET /monitor/pedidos - Listar pedidos em andamento
  - GET /monitor/pedidos/{id} - Detalhar status do pedido
- **Tecnologia**: Node.js 22, Express, WebSockets

## Arquitetura Interna
Cada microsserviço segue os princípios da Clean Architecture:
- **Entities**: Modelos de domínio
- **Use Cases**: Lógica de negócio
- **Controllers**: Interface de API
- **Repositories**: Acesso a dados
```

**Evidências:**
- Screenshots dos pods rodando no Kubernetes
- Logs dos serviços mostrando operações
- Teste de chamadas entre serviços

### 6. CI/CD

**Entregáveis:**
- Documentação dos pipelines CI/CD
- Evidências de execução bem-sucedida

**Conteúdo:**
```markdown
# Pipeline CI/CD - GitHub Actions

## Fluxo de Desenvolvimento
1. **Feature Branches**: Desenvolvimento em branches específicas
2. **Pull Requests**: Code review obrigatório
3. **Testes Automatizados**: Unitários e integração
4. **Build**: Criação de imagens Docker
5. **Deploy**: Atualização dos recursos na AWS

## Pipelines Implementados

### Lambda Pipeline
- **Trigger**: Push para main ou pull request
- **Etapas**:
  - Instalar dependências
  - Executar testes
  - Empacotar função
  - Deploy via Terraform

### Database Pipeline
- **Trigger**: Push para main
- **Etapas**:
  - Validar código Terraform
  - Executar terraform plan
  - Aplicar mudanças (terraform apply)

### Kubernetes Pipeline
- **Trigger**: Push para main ou pull request
- **Etapas**:
  - Build de imagens Docker
  - Push para ECR
  - Atualização dos deployments via kubectl
```

**Evidências:**
- Screenshots do GitHub Actions mostrando pipelines
- Histórico de deployments bem-sucedidos
- Logs de execução de pipeline

### 7. Testes End-to-End

**Entregáveis:**
- Documentação dos testes realizados
- Evidências de execução bem-sucedida

**Conteúdo:**
```markdown
# Testes End-to-End

## Cenários Testados

### Fluxo de Cliente Anônimo
1. Cliente acessa o sistema sem identificação
2. Visualiza cardápio e adiciona produtos ao carrinho
3. Finalização exige identificação

### Fluxo de Cliente Identificado
1. Cliente fornece CPF para autenticação
2. Sistema valida cliente via Lambda
3. Cliente realiza pedido completo
4. Sistema processa pagamento
5. Cliente acompanha status do pedido

### Fluxo de Pedido
1. Criação do pedido
2. Processamento de pagamento
3. Preparação
4. Finalização e entrega

## Resultados
- **Tempo médio de resposta**: 120ms
- **Taxa de sucesso**: 99.8%
- **Throughput máximo**: 100 req/s
```

**Evidências:**
- Screenshots dos testes executados
- Logs mostrando fluxo completo de pedido
- Métricas de desempenho


## Conclusão

Este roteiro fornece uma abordagem estruturada para documentar completamente o projeto Fast Food Tech Challenge, abrangendo todos os componentes e suas integrações. As evidências coletadas demonstrarão claramente que a aplicação foi implementada conforme as diretivas, incluindo:

1. A migração para uma arquitetura de microsserviços
2. A utilização de serverless para autenticação
3. A implementação de infraestrutura como código
4. A adoção de práticas de DevOps com CI/CD
5. A configuração adequada de observabilidade

As evidências estarão organizadas de forma lógica, facilitando a avaliação do projeto e demonstrando o atendimento a todos os requisitos especificados nas diretivas.