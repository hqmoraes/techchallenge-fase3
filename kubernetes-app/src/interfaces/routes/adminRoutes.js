const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

/**
 * @swagger
 * /admin/clientes:
 *   get:
 *     summary: Gerencia clientes
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Lista de clientes gerenciada com sucesso
 *       500:
 *         description: Erro ao gerenciar clientes
 * 
 * /admin/produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Lista de produtos gerenciada com sucesso
 *       500:
 *         description: Erro ao gerenciar produtos
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - preco
 *               - categoriaId
 *             properties:
 *               nome:
 *                 type: string
 *               preco:
 *                 type: number
 *               categoriaId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Erro na criação do produto
 * 
 * /admin/categorias:
 *   get:
 *     summary: Lista todas as categorias
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Lista de categorias gerenciada com sucesso
 *       500:
 *         description: Erro ao gerenciar categorias
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *       400:
 *         description: Erro na criação da categoria
 */

router.get('/clientes', adminController.gerenciarClientes);
router.get('/produtos', adminController.gerenciarProdutos);
router.get('/categorias', adminController.gerenciarCategorias);
router.post('/produtos', adminController.criarProduto);
router.post('/categorias', adminController.criarCategoria);

module.exports = router;