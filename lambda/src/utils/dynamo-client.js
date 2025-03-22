// lambda/src/utils/dynamo-client.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Configuração do cliente DynamoDB
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  maxAttempts: 5, // Adicione retries
  retryMode: 'standard',
  // Uso de endpoint local para desenvolvimento, quando especificado
  ...(process.env.DYNAMODB_ENDPOINT && { 
    endpoint: process.env.DYNAMODB_ENDPOINT,
    credentials: {
      accessKeyId: 'local',
      secretAccessKey: 'local'
    }
  })
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

module.exports = { ddbDocClient };