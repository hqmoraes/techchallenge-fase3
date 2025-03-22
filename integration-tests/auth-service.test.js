// integration-tests/auth-service.test.js
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

// Configurar AWS com região correta
AWS.config.update({ region: 'us-east-1' });

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

// Mock para evitar problemas de circularidade JSON
jest.mock('axios');

describe('Autenticação Lambda-DynamoDB', () => {
  const testClient = {
    ClienteId: uuidv4(),
    nome: 'Cliente Teste',
    email: 'teste@exemplo.com',
    CPF: '529.982.247-25'
  };

  beforeAll(async () => {
    // Inserir cliente de teste no DynamoDB
    await dynamoDB.put({
      TableName: 'FastFoodClients',
      Item: testClient
    }).promise();
  });

  test('Deve autenticar cliente por CPF', async () => {
    const apiUrl = process.env.AUTH_API_URL;
    const cpf = '529.982.247-25';

    try {
      const response = await axios.post(`${apiUrl}/auth`, { cpf });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
    } catch (error) {
      console.error('Falha na autenticação:', error.message);
      throw error;
    }
  });

  test('Verifica conexão com DynamoDB', async () => {
    const dynamoDB = new AWS.DynamoDB();
    const params = {
      TableName: 'dev-FastFoodClients'
    };

    try {
      await dynamoDB.describeTable(params).promise();
      console.log('Conexão com DynamoDB bem-sucedida');
    } catch (error) {
      console.error('Falha na conexão com DynamoDB:', error.message);
      throw error;
    }
  });

  afterAll(async () => {
    // Remover cliente de teste
    await dynamoDB.delete({
      TableName: 'FastFoodClients',
      Key: { ClienteId: testClient.ClienteId }
    }).promise();
  });
});

describe('Integração App-Autenticação', () => {
  test('App deve se conectar ao serviço de autenticação', async () => {
    const authApiUrl = process.env.AUTH_API_URL;
    const testClientCPF = '529.982.247-25'; // CPF de teste

    try {
      const response = await axios.post(`${authApiUrl}/auth`, {
        cpf: testClientCPF
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
    } catch (error) {
      console.error('Falha na autenticação:', error.message);
      throw error;
    }
  });
});