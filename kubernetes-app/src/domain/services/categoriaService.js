// src/services/categoriaService.js
const { ddbDocClient } = require('../../infrastructure/database/awsConfig');
const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const TABLE_NAME = 'FastFoodCategories';

class CategoriaService {
  async criarCategoria(categoria) {
    const params = {
      TableName: TABLE_NAME,
      Item: categoria,
    };
    await ddbDocClient.send(new PutCommand(params));
    return { message: 'Categoria criada com sucesso', categoria };
  }

  async obterCategoria(categoriaId) {
    const params = {
      TableName: TABLE_NAME,
      Key: { CategoriaId: categoriaId },
    };
    const result = await ddbDocClient.send(new GetCommand(params));
    return result.Item;
  }

  async atualizarCategoria(categoriaId, updates) {
    const params = {
      TableName: TABLE_NAME,
      Key: { CategoriaId: categoriaId },
      UpdateExpression: 'set #nome = :nome',
      ExpressionAttributeNames: { '#nome': 'nome' },
      ExpressionAttributeValues: { ':nome': updates.nome },
      ReturnValues: 'UPDATED_NEW',
    };
    const result = await ddbDocClient.send(new UpdateCommand(params));
    return result.Attributes;
  }

  async excluirCategoria(categoriaId) {
    const params = {
      TableName: TABLE_NAME,
      Key: { CategoriaId: categoriaId },
    };
    await ddbDocClient.send(new DeleteCommand(params));
    return { message: 'Categoria excluída com sucesso' };
  }

  async listarCategorias() {
    const params = {
      TableName: TABLE_NAME,
    };
    const result = await ddbDocClient.send(new ScanCommand(params));
    return result.Items;
  }
}

module.exports = new CategoriaService();