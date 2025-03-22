const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *       400:
 *         description: Erro na criação do cliente
 * 
 * /clientes/{clienteId}:
 *   get:
 *     summary: Obtém um cliente pelo ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 * 
 *   put:
 *     summary: Atualiza um cliente pelo ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       400:
 *         description: Erro na atualização do cliente
 * 
 *   delete:
 *     summary: Exclui um cliente pelo ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente excluído com sucesso
 *       404:
 *         description: Cliente não encontrado
 */

router.post('/', clienteController.criarCliente);
router.get('/:clienteId', clienteController.obterCliente);
router.put('/:clienteId', clienteController.atualizarCliente);
router.delete('/:clienteId', clienteController.excluirCliente);

module.exports = router;