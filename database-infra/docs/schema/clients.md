// database-infra/docs/schema/clients.md
# Modelo de Dados - Clientes

## Tabela FastFoodClients

### Chave Primária
- **ClienteId** (String): Identificador único do cliente (UUID)

### Atributos
- **Nome** (String): Nome completo do cliente
- **Email** (String): Endereço de e-mail do cliente
- **CPF** (String): CPF do cliente (usado para autenticação)
- **Telefone** (String): Número de telefone do cliente
- **DataCadastro** (String): Data de cadastro no formato ISO

### Índices Secundários Globais
- **CPFIndex**: Permite buscar clientes por CPF
  - Chave de partição: CPF

### Exemplo de Item
```json
{
  "ClienteId": "550e8400-e29b-41d4-a716-446655440000",
  "Nome": "João Silva",
  "Email": "joao@exemplo.com",
  "CPF": "12345678900",
  "Telefone": "11999998888",
  "DataCadastro": "2023-05-15T14:30:00Z"
}