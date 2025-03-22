const clienteService = require('../services/clienteService');

exports.criarCliente = async (req, res) => {
  try {
    const cliente = req.body;
    const resultado = await clienteService.criarCliente(cliente);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obterCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const cliente = await clienteService.obterCliente(clienteId);
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.atualizarCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const updates = req.body;
    const resultado = await clienteService.atualizarCliente(clienteId, updates);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.excluirCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const resultado = await clienteService.excluirCliente(clienteId);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};