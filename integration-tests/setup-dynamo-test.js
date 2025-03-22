// setup-dynamo-test.js
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB({ region: 'us-east-1' });

// Configura credenciais para acesso de teste
process.env.AWS_ACCESS_KEY_ID = 'SeuAccessKeyId';
process.env.AWS_SECRET_ACCESS_KEY = 'SuaSecretAccessKey';

async function setupTestTables() {
  try {
    // Verifica se a tabela de teste já existe
    await dynamoDb.createTable({
      TableName: 'test-FastFoodClients',
      KeySchema: [{ AttributeName: 'cpf', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'cpf', AttributeType: 'S' }],
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }).promise();
    
    // Insere dados de teste
    const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
    await docClient.put({
      TableName: 'test-FastFoodClients',
      Item: {
        cpf: '529.982.247-25',
        name: 'Cliente Teste',
        email: 'teste@example.com'
      }
    }).promise();
    
    console.log('Ambiente de teste configurado com sucesso');
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('Tabela de teste já existe, continuando...');
    } else {
      console.error('Erro ao configurar ambiente de teste:', error);
    }
  }
}