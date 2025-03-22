// Para: /mnt/c/Users/henri/OneDrive/Documentos/FIAP/project3/lambda/tests/integration/auth.test.js
const { handler } = require('../../src/functions/auth/index');
const { mockClient } = require('aws-sdk-client-mock');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Autenticação - Testes de Integração', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  test('Deve retornar token quando CPF existe no banco', async () => {
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
  });
});