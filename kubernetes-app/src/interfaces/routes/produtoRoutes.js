const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Produto:
 *       type: object
 *       required:
 *         - nome
 *         - preco
 *         - categoriaId
 *       properties:
 *         id:
 *           type: string
 *         nome:
 *           type: string
 *         preco:
 *           type: number
 *         categoriaId:
 *           type: string
 * 
 * paths:
 *   /api/produtos:
 *     get:
 *       summary: Lista todos os produtos
 *       tags: [Produtos]
 *       responses:
 *         200:
 *           description: Lista de produtos
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Produto'
 *     post:
 *       summary: Cria um novo produto
 *       tags: [Produtos]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       responses:
 *         201:
 *           description: Produto criado com sucesso
 *         400:
 *           description: Erro na criação do produto
 * 
 *   /api/produtos/{produtoId}:
 *     get:
 *       summary: Obtém um produto pelo ID
 *       tags: [Produtos]
 *       parameters:
 *         - in: path
 *           name: produtoId
 *           schema:
 *             type: string
 *           required: true
 *           description: ID do produto
 *       responses:
 *         200:
 *           description: Produto encontrado
 *         404:
 *           description: Produto não encontrado
 *     put:
 *       summary: Atualiza um produto pelo ID
 *       tags: [Produtos]
 *       parameters:
 *         - in: path
 *           name: produtoId
 *           schema:
 *             type: string
 *           required: true
 *           description: ID do produto
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       responses:
 *         200:
 *           description: Produto atualizado com sucesso
 *         404:
 *           description: Produto não encontrado
 */

router.get('/', produtoController.listarProdutos);
router.post('/', produtoController.criarProduto);
router.get('/:produtoId', produtoController.obterProduto);
router.put('/:produtoId', produtoController.atualizarProduto);
router.delete('/:produtoId', produtoController.excluirProduto);

module.exports = router;