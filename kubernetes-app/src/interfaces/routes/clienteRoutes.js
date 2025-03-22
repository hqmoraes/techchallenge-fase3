const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Definição das rotas
router.post('/', clienteController.criarCliente);
router.get('/:clienteId', clienteController.obterCliente);
router.put('/:clienteId', clienteController.atualizarCliente);
router.delete('/:clienteId', clienteController.excluirCliente);

module.exports = router;