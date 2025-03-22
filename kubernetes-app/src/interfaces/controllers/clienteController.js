const clienteService = require('../../domain/services/clienteService');

exports.criarCliente = async (req, res) => {
  try {
    const cliente = req.body;
    const result = await clienteService.criarCliente(cliente);
    res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.obterCliente = async (req, res) => {
  try {
    const clienteId = req.params.clienteId;
    const result = await clienteService.obterCliente(clienteId);
    if (!result) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao obter cliente:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.atualizarCliente = async (req, res) => {
  try {
    const clienteId = req.params.clienteId;
    const updates = req.body;
    const result = await clienteService.atualizarCliente(clienteId, updates);
    res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.excluirCliente = async (req, res) => {
  try {
    const clienteId = req.params.clienteId;
    const result = await clienteService.excluirCliente(clienteId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    res.status(500).json({ error: error.message });
  }
};