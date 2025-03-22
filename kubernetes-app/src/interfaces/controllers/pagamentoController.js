const pagamentoService = require('../../domain/services/pagamentoService');

exports.criarPagamento = async (req, res) => {
  try {
    const pagamento = req.body;
    const result = await pagamentoService.criarPagamento(pagamento);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obterPagamento = async (req, res) => {
  try {
    const pagamentoId = req.params.pagamentoId;
    const result = await pagamentoService.obterPagamento(pagamentoId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.atualizarPagamento = async (req, res) => {
  try {
    const pagamentoId = req.params.pagamentoId;
    const updates = req.body;
    const result = await pagamentoService.atualizarPagamento(pagamentoId, updates);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.excluirPagamento = async (req, res) => {
  try {
    const pagamentoId = req.params.pagamentoId;
    const result = await pagamentoService.excluirPagamento(pagamentoId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.gerarQRCode = async (req, res) => {
  try {
    const { pedidoId, valor } = req.body;
    const result = await pagamentoService.gerarQRCode(pedidoId, valor);
    res.status(200).json({ qrCode: result.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.receberWebhookPagamento = async (req, res) => {
  try {
    const dados = req.body;
    const result = await pagamentoService.receberWebhookPagamento(dados);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};