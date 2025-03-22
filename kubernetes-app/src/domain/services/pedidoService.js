const { ddbDocClient } = require('../../infrastructure/database/awsConfig');
const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const TABLE_NAME = 'FastFoodOrders';

class PedidoService {
  async criarPedido(pedido) {
    try {
      const novoPedido = {
        ...pedido,
        status: 'Recebido',
        createdAt: new Date().toISOString()
      };

      const params = {
        TableName: TABLE_NAME,
        Item: novoPedido,
      };
      
      await ddbDocClient.send(new PutCommand(params));
      return { message: 'Pedido criado com sucesso', pedido: novoPedido };
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw new Error('Erro ao criar pedido: ' + error.message);
    }
  }

  async obterPedido(pedidoId) {
    try {
      const params = {
        TableName: TABLE_NAME,
        Key: { PedidoId: pedidoId },
      };
      const result = await ddbDocClient.send(new GetCommand(params));
      return result.Item;
    } catch (error) {
      console.error('Erro ao obter pedido:', error);
      throw new Error('Erro ao obter pedido: ' + error.message);
    }
  }

  async atualizarPedido(pedidoId, updates) {
    try {
      const params = {
        TableName: TABLE_NAME,
        Key: { PedidoId: pedidoId },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status': updates.status },
        ReturnValues: 'UPDATED_NEW',
      };
      const result = await ddbDocClient.send(new UpdateCommand(params));
      return result.Attributes;
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      throw new Error('Erro ao atualizar pedido: ' + error.message);
    }
  }

  async excluirPedido(pedidoId) {
    try {
      const params = {
        TableName: TABLE_NAME,
        Key: { PedidoId: pedidoId },
      };
      await ddbDocClient.send(new DeleteCommand(params));
      return { message: 'Pedido excluído com sucesso' };
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      throw new Error('Erro ao excluir pedido: ' + error.message);
    }
  }

  async listarPedidos() {
    try {
      const params = {
        TableName: TABLE_NAME,
        FilterExpression: '#status <> :finalizado',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':finalizado': 'Finalizado'
        }
      };
      
      const result = await ddbDocClient.send(new ScanCommand(params));
      
      const statusPriority = {
        'Pronto': 0,
        'Em Preparação': 1,
        'Recebido': 2
      };

      return result.Items.sort((a, b) => {
        if (statusPriority[a.status] !== statusPriority[b.status]) {
          return statusPriority[a.status] - statusPriority[b.status];
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      throw new Error('Erro ao listar pedidos: ' + error.message);
    }
  }
}

module.exports = new PedidoService();