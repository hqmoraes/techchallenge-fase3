const adminService = require('../../domain/services/adminService');

exports.gerenciarClientes = async (req, res) => {
  try {
    const clientes = await adminService.listarClientes();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.gerenciarProdutos = async (req, res) => {
  try {
    const produtos = await adminService.listarProdutos();
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.gerenciarCategorias = async (req, res) => {
  try {
    const categorias = await adminService.listarCategorias();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.criarProduto = async (req, res) => {
  try {
    const produto = req.body;
    const novoProduto = await adminService.criarProduto(produto);
    res.status(201).json(novoProduto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.criarCategoria = async (req, res) => {
  try {
    const categoria = req.body;
    const novaCategoria = await adminService.criarCategoria(categoria);
    res.status(201).json(novaCategoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};