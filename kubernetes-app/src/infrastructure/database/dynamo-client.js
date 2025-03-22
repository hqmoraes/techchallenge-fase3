// DynamoDB client para a aplicação
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

class DynamoClient {
  constructor() {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.DYNAMODB_ENDPOINT
    });
    
    this.docClient = DynamoDBDocumentClient.from(client);
  }

  async get(params) {
    return this.docClient.send(new GetCommand(params));
  }

  async query(params) {
    return this.docClient.send(new QueryCommand(params));
  }

  async put(params) {
    return this.docClient.send(new PutCommand(params));
  }

  async update(params) {
    return this.docClient.send(new UpdateCommand(params));
  }

  async delete(params) {
    return this.docClient.send(new DeleteCommand(params));
  }

  async scan(params) {
    return this.docClient.send(new ScanCommand(params));
  }
}

module.exports = new DynamoClient();
