const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         nome:
 *           type: string
 *         id:
 *           type: string
 * 
 * paths:
 *   /api/categorias:
 *     get:
 *       summary: Lista todas as categorias
 *       tags: [Categorias]
 *       responses:
 *         200:
 *           description: Lista de categorias
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Categoria'
 *     post:
 *       summary: Cria uma nova categoria
 *       tags: [Categorias]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       responses:
 *         201:
 *           description: Categoria criada com sucesso
 *         400:
 *           description: Erro na criação da categoria
 * 
 *   /api/categorias/{categoriaId}:
 *     get:
 *       summary: Obtém uma categoria pelo ID
 *       tags: [Categorias]
 *       parameters:
 *         - in: path
 *           name: categoriaId
 *           schema:
 *             type: string
 *           required: true
 *           description: ID da categoria
 *       responses:
 *         200:
 *           description: Categoria encontrada
 *         404:
 *           description: Categoria não encontrada
 *     put:
 *       summary: Atualiza uma categoria pelo ID
 *       tags: [Categorias]
 *       parameters:
 *         - in: path
 *           name: categoriaId
 *           schema:
 *             type: string
 *           required: true
 *           description: ID da categoria
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       responses:
 *         200:
 *           description: Categoria atualizada com sucesso
 *         404:
 *           description: Categoria não encontrada
 */

router.get('/', categoriaController.listarCategorias);
router.post('/', categoriaController.criarCategoria);
router.get('/:categoriaId', categoriaController.obterCategoria);
router.put('/:categoriaId', categoriaController.atualizarCategoria);
router.delete('/:categoriaId', categoriaController.excluirCategoria);

module.exports = router;