const categoriaService = require('../../domain/services/categoriaService');

exports.criarCategoria = async (req, res) => {
  try {
    const categoria = req.body;
    const resultado = await categoriaService.criarCategoria(categoria);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obterCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params;
    const categoria = await categoriaService.obterCategoria(categoriaId);
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.atualizarCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params;
    const updates = req.body;
    const resultado = await categoriaService.atualizarCategoria(categoriaId, updates);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.excluirCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params;
    const resultado = await categoriaService.excluirCategoria(categoriaId);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listarCategorias = async (req, res) => {
  try {
    const categorias = await categoriaService.listarCategorias();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};