// src/services/produtoService.js
const { ddbDocClient } = require('../../infrastructure/database/awsConfig');
const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const TABLE_NAME = 'FastFoodProducts';

class ProdutoService {
  async criarProduto(produto) {
    const params = {
      TableName: TABLE_NAME,
      Item: produto,
    };
    await ddbDocClient.send(new PutCommand(params));
    return { message: 'Produto criado com sucesso', produto };
  }

  async obterProduto(produtoId) {
    const params = {
      TableName: TABLE_NAME,
      Key: { ProdutoId: produtoId },
    };
    const result = await ddbDocClient.send(new GetCommand(params));
    return result.Item;
  }

  async atualizarProduto(produtoId, updates) {
    const params = {
      TableName: TABLE_NAME,
      Key: { ProdutoId: produtoId },
      UpdateExpression: 'set #nome = :nome, #preco = :preco',
      ExpressionAttributeNames: { '#nome': 'nome', '#preco': 'preco' },
      ExpressionAttributeValues: { ':nome': updates.nome, ':preco': updates.preco },
      ReturnValues: 'UPDATED_NEW',
    };
    const result = await ddbDocClient.send(new UpdateCommand(params));
    return result.Attributes;
  }

  async excluirProduto(produtoId) {
    const params = {
      TableName: TABLE_NAME,
      Key: { ProdutoId: produtoId },
    };
    await ddbDocClient.send(new DeleteCommand(params));
    return { message: 'Produto excluído com sucesso' };
  }

  async listarProdutos() {
    const params = {
      TableName: TABLE_NAME,
    };
    const result = await ddbDocClient.send(new ScanCommand(params));
    return result.Items;
  }
}

module.exports = new ProdutoService();