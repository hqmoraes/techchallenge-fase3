const express = require('express');
const router = express.Router();
const acompanhamentoController = require('../controllers/acompanhamentoController');

/**
 * @swagger
 * /acompanhamento/{pedidoId}:
 *   get:
 *     summary: Acompanha um pedido pelo ID
 *     tags: [Acompanhamento]
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido acompanhado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */

router.get('/:pedidoId', acompanhamentoController.acompanharPedido);

module.exports = router;