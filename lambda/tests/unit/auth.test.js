// tests/integration/auth.test.js
const { handler } = require('../../src/functions/auth/index');
const { mockClient } = require('aws-sdk-client-mock');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Integração da Autenticação', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  test('Deve retornar token quando CPF existe no banco', async () => {
    // Configura o mock para retornar um cliente
    ddbMock.on(QueryCommand).resolves({
      Items: [
        {
          ClienteId: '123abc',
          nome: 'João Silva',
          email: 'joao@example.com',
          CPF: '52998224725'
        }
      ]
    });

    const event = {
      body: JSON.stringify({ cpf: '529.982.247-25' })
    };

    const response = await handler(event);
    const body = JSON.parse(response.body);
    
    expect(response.statusCode).toBe(200);
    expect(body.token).toBeDefined();
    expect(body.cliente.id).toBe('123abc');
    expect(body.cliente.nome).toBe('João Silva');
  });

  test('Deve retornar 404 quando CPF não existe no banco', async () => {
    // Configura o mock para retornar lista vazia
    ddbMock.on(QueryCommand).resolves({
      Items: []
    });

    const event = {
      body: JSON.stringify({ cpf: '52998224725' })
    };

    const response = await handler(event);
    
    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body).message).toContain('Cliente não encontrado');
  });

  test('Deve rejeitar CPF inválido', async () => {
    const event = {
      body: JSON.stringify({ cpf: '11111111111' })
    };

    const response = await handler(event);
    
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toContain('CPF inválido');
  });
});