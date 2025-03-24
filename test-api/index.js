const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Dados de exemplo
const orders = [
  { id: "1", customerName: "João", status: "READY", items: ["Hambúrguer", "Batata"] },
  { id: "2", customerName: "Maria", status: "PREPARING", items: ["Pizza", "Refrigerante"] }
];

// Health check
app.get('/health', (req, res) => {
  console.log('Health check chamado');
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Ready check
app.get('/ready', (req, res) => {
  console.log('Ready check chamado');
  res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
});

// API de pedidos
app.get('/api/orders', (req, res) => {
  console.log('Pedidos solicitados');
  res.status(200).json({ orders });
});

// API para categorias (mock)
app.get('/api/categories', (req, res) => {
  console.log('Categorias solicitadas');
  res.status(200).json({ 
    categories: [
      { id: "1", name: "Lanches" },
      { id: "2", name: "Bebidas" },
      { id: "3", name: "Sobremesas" }
    ] 
  });
});

// Root path
app.get('/', (req, res) => {
  console.log('Raiz acessada');
  res.status(200).json({ 
    message: 'API Fast Food funcionando!',
    endpoints: [
      '/health',
      '/ready',
      '/api/orders',
      '/api/categories'
    ] 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('Variáveis de ambiente:');
  console.log(`- PORT: ${process.env.PORT || 3000}`);
  console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
});
