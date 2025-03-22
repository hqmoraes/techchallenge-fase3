// lambda/scripts/seed-data.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.DYNAMODB_LOCAL_ENDPOINT || undefined
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

async function seedTestData() {
  try {
    console.log('Inserindo dados de teste no DynamoDB...');
    
    const clientesTeste = [
      {
        ClienteId: '123abc',
        nome: 'João Silva',
        email: 'joao@exemplo.com',
        CPF: '529.982.247-25'
      },
      {
        ClienteId: '456def',
        nome: 'Maria Souza',
        email: 'maria@exemplo.com',
        CPF: '987.654.321-00'
      }
    ];
    
    for (const cliente of clientesTeste) {
      await ddbDocClient.send(new PutCommand({
        TableName: 'FastFoodClients',
        Item: cliente
      }));
      console.log(`Cliente inserido: ${cliente.nome}`);
    }
    
    console.log('Dados de teste inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir dados de teste:', error);
  }
}

seedTestData();