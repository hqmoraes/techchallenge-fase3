const AWS = require('aws-sdk');

// Configuração padrão para produção (AWS)
const config = {
  region: process.env.AWS_REGION || 'us-east-1'
};

// Apenas para desenvolvimento local (não afeta produção)
if (process.env.DYNAMODB_ENDPOINT) {
  config.endpoint = process.env.DYNAMODB_ENDPOINT;
}

// Criar e exportar o cliente DynamoDB
const dynamoDb = new AWS.DynamoDB.DocumentClient(config);

module.exports = dynamoDb;