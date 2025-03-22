const { ddbDocClient } = require('../../infrastructure/database/awsConfig');
const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const axios = require('axios');
const TABLE_NAME = 'FastFoodPayments';

class PagamentoService {
  async criarPagamento(pagamento) {
    const params = {
      TableName: TABLE_NAME,
      Item: pagamento,
    };
    await ddbDocClient.send(new PutCommand(params));
    return { message: 'Pagamento criado com sucesso', pagamento };
  }

  async obterPagamento(pagamentoId) {
    const params = {
      TableName: TABLE_NAME,
      Key: { PagamentoId: pagamentoId },
    };
    const result = await ddbDocClient.send(new GetCommand(params));
    return result.Item;
  }

  async atualizarPagamento(pagamentoId, updates) {
    const params = {
      TableName: TABLE_NAME,
      Key: { PagamentoId: pagamentoId },
      UpdateExpression: 'set #status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': updates.status },
      ReturnValues: 'UPDATED_NEW',
    };
    const result = await ddbDocClient.send(new UpdateCommand(params));
    return result.Attributes;
  }

  async excluirPagamento(pagamentoId) {
    const params = {
      TableName: TABLE_NAME,
      Key: { PagamentoId: pagamentoId },
    };
    await ddbDocClient.send(new DeleteCommand(params));
    return { message: 'Pagamento excluído com sucesso' };
  }

  async listarPagamentos() {
    const params = {
      TableName: TABLE_NAME,
    };
    const result = await ddbDocClient.send(new ScanCommand(params));
    return result.Items;
  }

  async gerarQRCode(pedidoId, valor) {
    const qrCodeData = { pedidoId, valor };
    const response = await axios.post('https://api.mercadopago.com/qrcodes', qrCodeData);
    return response.data;
  }

  consultarStatusPagamento(pagamentoId) {
    return this.obterPagamento(pagamentoId);
  }

  receberWebhookPagamento(dados) {
    const { paymentId, status } = dados;
    return this.atualizarPagamento(paymentId, { status });
  }
}

module.exports = new PagamentoService();