const { ddbDocClient } = require('../../infrastructure/database/awsConfig');
const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const TABLE_NAME = 'FastFoodClients';

class ClienteService {
  async criarCliente(cliente) {
    const params = {
      TableName: TABLE_NAME,
      Item: cliente,
    };
    await ddbDocClient.send(new PutCommand(params));
    return { message: 'Cliente criado com sucesso', cliente };
  }

  async obterCliente(clienteId) {
    const params = {
      TableName: TABLE_NAME,
      Key: { ClienteId: clienteId },
    };
    const result = await ddbDocClient.send(new GetCommand(params));
    return result.Item;
  }

  async atualizarCliente(clienteId, updates) {
    const params = {
      TableName: TABLE_NAME,
      Key: { ClienteId: clienteId },
      UpdateExpression: 'set #nome = :nome, #email = :email',
      ExpressionAttributeNames: { '#nome': 'nome', '#email': 'email' },
      ExpressionAttributeValues: { ':nome': updates.nome, ':email': updates.email },
      ReturnValues: 'UPDATED_NEW',
    };
    const result = await ddbDocClient.send(new UpdateCommand(params));
    return result.Attributes;
  }

  async excluirCliente(clienteId) {
    const params = {
      TableName: TABLE_NAME,
      Key: { ClienteId: clienteId },
    };
    await ddbDocClient.send(new DeleteCommand(params));
    return { message: 'Cliente excluído com sucesso' };
  }

  async listarClientes() {
    const params = {
      TableName: TABLE_NAME,
    };
    const result = await ddbDocClient.send(new ScanCommand(params));
    return result.Items;
  }
}

module.exports = new ClienteService();