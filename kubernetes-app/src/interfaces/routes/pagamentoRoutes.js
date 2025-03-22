const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');

/**
 * @swagger
 * /pagamentos:
 *   post:
 *     summary: Cria um novo pagamento
 *     tags: [Pagamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pagamento'
 *     responses:
 *       201:
 *         description: Pagamento criado com sucesso
 *       400:
 *         description: Erro na criação do pagamento
 * 
 * /pagamentos/{pagamentoId}:
 *   get:
 *     summary: Obtém um pagamento pelo ID
 *     tags: [Pagamentos]
 *     parameters:
 *       - in: path
 *         name: pagamentoId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pagamento
 *     responses:
 *       200:
 *         description: Pagamento encontrado
 *       404:
 *         description: Pagamento não encontrado
 * 
 *   put:
 *     summary: Atualiza um pagamento pelo ID
 *     tags: [Pagamentos]
 *     parameters:
 *       - in: path
 *         name: pagamentoId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pagamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pagamento'
 *     responses:
 *       200:
 *         description: Pagamento atualizado com sucesso
 *       400:
 *         description: Erro na atualização do pagamento
 * 
 *   delete:
 *     summary: Exclui um pagamento pelo ID
 *     tags: [Pagamentos]
 *     parameters:
 *       - in: path
 *         name: pagamentoId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pagamento
 *     responses:
 *       200:
 *         description: Pagamento excluído com sucesso
 *       404:
 *         description: Pagamento não encontrado
 * 
 * /pagamentos/qrcode:
 *   post:
 *     summary: Gera um QR Code para pagamento
 *     tags: [Pagamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PagamentoQRCode'
 *     responses:
 *       201:
 *         description: QR Code gerado com sucesso
 *       400:
 *         description: Erro na geração do QR Code
 * 
 * /pagamentos/webhook:
 *   post:
 *     summary: Recebe notificações de pagamento via webhook
 *     tags: [Pagamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PagamentoWebhook'
 *     responses:
 *       200:
 *         description: Webhook recebido com sucesso
 *       400:
 *         description: Erro ao receber webhook
 */

router.post('/', pagamentoController.criarPagamento);
router.get('/:pagamentoId', pagamentoController.obterPagamento);
router.put('/:pagamentoId', pagamentoController.atualizarPagamento);
router.delete('/:pagamentoId', pagamentoController.excluirPagamento);
router.post('/qrcode', pagamentoController.gerarQRCode);
router.post('/webhook', pagamentoController.receberWebhookPagamento);

module.exports = router;