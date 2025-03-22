const produtoService = require('../../domain/services/produtoService');

exports.criarProduto = async (req, res) => {
  try {
    const produto = req.body;
    console.log('Criando produto:', produto); 
    const resultado = await produtoService.criarProduto(produto);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.obterProduto = async (req, res) => {
  try {
    const { produtoId } = req.params;
    const produto = await produtoService.obterProduto(produtoId);
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.atualizarProduto = async (req, res) => {
  try {
    const { produtoId } = req.params;
    const updates = req.body;
    const resultado = await produtoService.atualizarProduto(produtoId, updates);
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.excluirProduto = async (req, res) => {
  try {
    const { produtoId } = req.params;
    const resultado = await produtoService.excluirProduto(produtoId);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listarProdutos = async (req, res) => {
  try {
    const produtos = await produtoService.listarProdutos();
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};