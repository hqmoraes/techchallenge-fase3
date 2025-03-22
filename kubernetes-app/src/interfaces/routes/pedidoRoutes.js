const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.post('/', pedidoController.criarPedido);
router.get('/:pedidoId', pedidoController.obterPedido);
router.put('/:pedidoId', pedidoController.atualizarPedido);
router.delete('/:pedidoId', pedidoController.excluirPedido);

module.exports = router;