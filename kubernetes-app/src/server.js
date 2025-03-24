import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middleware
app.use(cors());
app.use(express.json());

// Configurar DynamoDB
const dynamoConfig = {
  region: process.env.AWS_REGION || 'us-east-1'
};

// Se estiver em ambiente de desenvolvimento, use o endpoint local
if (process.env.DYNAMODB_ENDPOINT) {
  dynamoConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
}

const client = new DynamoDBClient(dynamoConfig);
const dynamoDB = DynamoDBDocumentClient.from(client);

// Rota básica de health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Rota de ready check
app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
});

// Rota para pedidos
app.get('/api/orders', async (req, res) => {
  try {
    const tableName = process.env.DYNAMODB_ORDERS_TABLE;
    console.log(`Buscando pedidos na tabela: ${tableName}`);
    
    // Dados mock para testes
    const mockOrders = [
      { id: '1', customerName: 'João', status: 'READY', items: ['Hambúrguer', 'Batata'] },
      { id: '2', customerName: 'Maria', status: 'PREPARING', items: ['Pizza', 'Refrigerante'] }
    ];
    
    // Se não temos uma tabela definida ou estamos em ambiente de teste
    if (!tableName || process.env.NODE_ENV === 'test') {
      return res.status(200).json({ 
        message: 'Usando dados simulados',
        orders: mockOrders
      });
    }
    
    // Tentar buscar dados reais do DynamoDB
    try {
      const params = { TableName: tableName };
      const data = await dynamoDB.send(new ScanCommand(params));
      res.status(200).json({ orders: data.Items || [] });
    } catch (dbError) {
      console.error(`Erro ao acessar DynamoDB: ${dbError.message}`);
      res.status(200).json({ 
        message: 'Falha ao acessar o DynamoDB, exibindo dados simulados',
        error: dbError.message,
        orders: mockOrders
      });
    }
  } catch (error) {
    console.error('Erro ao processar a requisição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Ready check: http://localhost:${PORT}/ready`);
  console.log(`API de pedidos: http://localhost:${PORT}/api/orders`);
  
  // Mostrar variáveis de ambiente (sem valores sensíveis)
  console.log('Variáveis de ambiente:');
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`- PORT: ${process.env.PORT}`);
  console.log(`- DYNAMODB_ORDERS_TABLE: ${process.env.DYNAMODB_ORDERS_TABLE}`);
  console.log(`- AWS_REGION: ${process.env.AWS_REGION}`);
  console.log(`- DYNAMODB_ENDPOINT: ${process.env.DYNAMODB_ENDPOINT || 'não definido'}`);
});
