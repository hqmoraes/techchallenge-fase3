// src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const pedidoRoutes = require('./interfaces/routes/pedidoRoutes');
const pagamentoRoutes = require('./interfaces/routes/pagamentoRoutes');
const acompanhamentoRoutes = require('./interfaces/routes/acompanhamentoRoutes');
const adminRoutes = require('./interfaces/routes/adminRoutes');
const clienteRoutes = require('./interfaces/routes/clienteRoutes');
const produtoRoutes = require('./interfaces/routes/produtoRoutes');
const categoriaRoutes = require('./interfaces/routes/categoriaRoutes');
const swaggerUi = require('swagger-ui-express');
const specs = require('./infrastructure/config/swagger');
const authMiddleware = require('./interfaces/middlewares/authMiddleware');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.json());

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Aplicar middleware globalmente (exceto rotas públicas)
app.use('/clientes', authMiddleware);
app.use('/pedidos', authMiddleware);

// Ajuste das rotas para a nova estrutura
app.use('/pedidos', pedidoRoutes);
app.use('/pagamentos', pagamentoRoutes);
app.use('/acompanhamento', acompanhamentoRoutes);
app.use('/admin', adminRoutes);
app.use('/clientes', clienteRoutes);
app.use('/produtos', produtoRoutes);
app.use('/categorias', categoriaRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}

module.exports = app;