// src/services/acompanhamentoService.js
const PedidoService = require('./pedidoService');

class AcompanhamentoService {
  async acompanharPedido(pedidoId) {
    try {
      const pedido = await PedidoService.obterPedido(pedidoId);
      if (!pedido) {
        throw new Error('Pedido não encontrado');
      }
      return {
        status: pedido.status,
        etapas: ['Recebido', 'Em preparação', 'Pronto', 'Finalizado'],
        etapaAtual: pedido.status,
      };
    } catch (error) {
      throw new Error('Erro ao acompanhar pedido: ' + error.message);
    }
  }
}

module.exports = new AcompanhamentoService();