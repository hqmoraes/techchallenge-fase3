const { ddbDocClient } = require('../../infrastructure/database/awsConfig');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const ClienteService = require('./clienteService');
const ProdutoService = require('./produtoService');
const CategoriaService = require('./categoriaService');

class AdminService {
  async listarClientes() {
    try {
      const clientes = await ClienteService.listarClientes();
      return clientes;
    } catch (error) {
      throw new Error('Erro ao listar clientes: ' + error.message);
    }
  }

  async listarProdutos() {
    try {
      const produtos = await ProdutoService.listarProdutos();
      return produtos;
    } catch (error) {
      throw new Error('Erro ao listar produtos: ' + error.message);
    }
  }

  async listarCategorias() {
    try {
      const categorias = await CategoriaService.listarCategorias();
      return categorias;
    } catch (error) {
      throw new Error('Erro ao listar categorias: ' + error.message);
    }
  }

  async criarProduto(produto) {
    try {
      const novoProduto = await ProdutoService.criarProduto(produto);
      return novoProduto;
    } catch (error) {
      throw new Error('Erro ao criar produto: ' + error.message);
    }
  }

  async criarCategoria(categoria) {
    try {
      const novaCategoria = await CategoriaService.criarCategoria(categoria);
      return novaCategoria;
    } catch (error) {
      throw new Error('Erro ao criar categoria: ' + error.message);
    }
  }
}

module.exports = new AdminService();