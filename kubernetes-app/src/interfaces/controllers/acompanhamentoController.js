const acompanhamentoService = require('../../domain/services/acompanhamentoService');

exports.acompanharPedido = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const resultado = await acompanhamentoService.acompanharPedido(pedidoId);
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro ao acompanhar pedido:', error); // Adicione este log
    res.status(500).json({ error: error.message });
  }
};