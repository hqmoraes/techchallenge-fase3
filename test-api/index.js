const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Dados de exemplo
const pedidos = [
  { 
    id: "1", 
    cliente: "João Silva", 
    status: "PRONTO", 
    items: [
      { produtoId: "1", nome: "Hambúrguer", quantidade: 1, valorUnitario: 18.90 },
      { produtoId: "3", nome: "Batata Frita", quantidade: 1, valorUnitario: 9.90 }
    ],
    valorTotal: 28.80,
    dataHora: new Date(Date.now() - 1000*60*30).toISOString() // 30 minutos atrás
  },
  { 
    id: "2", 
    cliente: "Maria Oliveira", 
    status: "EM_PREPARACAO", 
    items: [
      { produtoId: "2", nome: "Pizza", quantidade: 1, valorUnitario: 32.90 },
      { produtoId: "5", nome: "Refrigerante", quantidade: 1, valorUnitario: 7.90 }
    ],
    valorTotal: 40.80,
    dataHora: new Date(Date.now() - 1000*60*15).toISOString() // 15 minutos atrás
  }
];

const produtos = [
  { id: "1", nome: "Hambúrguer", descricao: "Hambúrguer com queijo e bacon", preco: 18.90, categoriaId: "1", imagem: "hamburger.jpg" },
  { id: "2", nome: "Pizza", descricao: "Pizza de pepperoni", preco: 32.90, categoriaId: "1", imagem: "pizza.jpg" },
  { id: "3", nome: "Batata Frita", descricao: "Porção de batata frita", preco: 9.90, categoriaId: "2", imagem: "batata.jpg" },
  { id: "4", nome: "Sorvete", descricao: "Sorvete de chocolate", preco: 12.90, categoriaId: "3", imagem: "sorvete.jpg" },
  { id: "5", nome: "Refrigerante", descricao: "Refrigerante lata 350ml", preco: 7.90, categoriaId: "4", imagem: "refrigerante.jpg" }
];

const categorias = [
  { id: "1", nome: "Lanches", descricao: "Hambúrgueres, pizzas e outros lanches" },
  { id: "2", nome: "Acompanhamentos", descricao: "Batatas fritas, onion rings e outros acompanhamentos" },
  { id: "3", nome: "Sobremesas", descricao: "Sorvetes, tortas e outras sobremesas" },
  { id: "4", nome: "Bebidas", descricao: "Refrigerantes, sucos e outras bebidas" }
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
app.get('/api/pedidos', (req, res) => {
  console.log('Pedidos solicitados');
  res.status(200).json({ pedidos });
});

// Obter pedido por ID
app.get('/api/pedidos/:id', (req, res) => {
  const id = req.params.id;
  console.log(`Pedido ${id} solicitado`);
  const pedido = pedidos.find(p => p.id === id);
  
  if (pedido) {
    res.status(200).json(pedido);
  } else {
    res.status(404).json({ error: 'Pedido não encontrado' });
  }
});

// Atualizar status do pedido
app.put('/api/pedidos/:id/status', (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  console.log(`Atualizando status do pedido ${id} para ${status}`);
  
  const pedido = pedidos.find(p => p.id === id);
  if (pedido) {
    pedido.status = status;
    res.status(200).json(pedido);
  } else {
    res.status(404).json({ error: 'Pedido não encontrado' });
  }
});

// Criar novo pedido
app.post('/api/pedidos', (req, res) => {
  const { cliente, items } = req.body;
  console.log(`Criando pedido para ${cliente}`);
  
  const valorTotal = items.reduce((total, item) => total + (item.quantidade * item.valorUnitario), 0);
  
  const novoPedido = {
    id: (pedidos.length + 1).toString(),
    cliente,
    status: "RECEBIDO",
    items,
    valorTotal,
    dataHora: new Date().toISOString()
  };
  
  pedidos.push(novoPedido);
  res.status(201).json(novoPedido);
});

// API para produtos
app.get('/api/produtos', (req, res) => {
  console.log('Produtos solicitados');
  res.status(200).json({ produtos });
});

// API para categorias
app.get('/api/categorias', (req, res) => {
  console.log('Categorias solicitadas');
  res.status(200).json({ categorias });
});

// Root path
app.get('/', (req, res) => {
  console.log('Raiz acessada');
  res.status(200).json({ 
    message: 'API Fast Food funcionando!',
    endpoints: [
      '/health',
      '/ready',
      '/api/pedidos',
      '/api/produtos',
      '/api/categorias',
      '/swagger',
      '/api-docs',
      '/swagger.json'
    ] 
  });
});

// Configurar Swagger
try {
  const setupSwagger = require('./swagger-config');
  setupSwagger(app);
} catch (error) {
  console.error('Erro ao configurar Swagger:', error.message);
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('Endpoints disponíveis:');
  console.log('- /health            - Verificação de saúde');
  console.log('- /ready             - Verificação de disponibilidade');
  console.log('- /api/pedidos       - Gerenciamento de pedidos');
  console.log('- /api/produtos      - Lista de produtos');
  console.log('- /api/categorias    - Lista de categorias');
  console.log('- /swagger           - Documentação Swagger');
  console.log('- /api-docs          - Documentação Swagger (alternativo)');
  console.log('- /swagger.json      - Definição OpenAPI');
  console.log('\nVariáveis de ambiente:');
  console.log(`- PORT: ${process.env.PORT || 3000}`);
  console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
});
