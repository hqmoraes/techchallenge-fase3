const pedidoService = require('../../domain/services/pedidoService');

exports.criarPedido = async (req, res) => {
  try {
    const pedido = req.body;
    const resultado = await pedidoService.criarPedido(pedido);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.obterPedido = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const pedido = await pedidoService.obterPedido(pedidoId);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.status(200).json(pedido);
  } catch (error) {
    console.error('Erro ao obter pedido:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.listarPedidos = async (req, res) => {
  try {
    const pedidos = await pedidoService.listarPedidos();
    res.status(200).json(pedidos);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.atualizarPedido = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const updates = req.body;
    const resultado = await pedidoService.atualizarPedido(pedidoId, updates);
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.excluirPedido = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const resultado = await pedidoService.excluirPedido(pedidoId);
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro ao excluir pedido:', error);
    res.status(500).json({ error: error.message });
  }
};