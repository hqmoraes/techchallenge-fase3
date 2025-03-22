// integration-tests/fix-data.js
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

async function criarClienteTeste() {
  console.log('Inserindo dados de cliente para teste...');
  
  try {
    // Inserir cliente de teste no DynamoDB
    await dynamoDB.put({
      TableName: 'dev-FastFoodClients',
      Item: {
        cpf: '529.982.247-25',
        nome: 'Cliente Teste',
        email: 'teste@example.com',
        telefone: '11999999999'
      }
    }).promise();
    
    console.log('Cliente de teste inserido com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir cliente:', error);
  }
}

criarClienteTeste();