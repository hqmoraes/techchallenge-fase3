const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const MAX_RETRIES = 5;
const RETRY_DELAY = 3000;

const config = {
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local'
  }
};

const client = new DynamoDBClient(config);
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Função para aguardar com delay
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Função para tentar conectar com retry
async function tryConnect(retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Tentativa ${i + 1} de ${retries} para conectar ao DynamoDB...`);
      await client.send(new CreateTableCommand({
        TableName: '_test_connection',
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1
        }
      }));
      console.log('Conexão estabelecida com sucesso!');
      return true;
    } catch (error) {
      if (error.name === 'ResourceInUseException') {
        console.log('Conexão estabelecida com sucesso!');
        return true;
      }
      console.log(`Tentativa ${i + 1} falhou. ${error.message}`);
      if (i < retries - 1) {
        console.log(`Aguardando ${RETRY_DELAY/1000} segundos antes da próxima tentativa...`);
        await wait(RETRY_DELAY);
      }
    }
  }
  return false;
}

const tables = [
  {
    TableName: 'FastFoodClients',
    KeySchema: [
      { AttributeName: 'ClientId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'ClientId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  {
    TableName: 'FastFoodProducts',
    KeySchema: [
      { AttributeName: 'ProdutoId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'ProdutoId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  {
    TableName: 'FastFoodOrders',
    KeySchema: [
      { AttributeName: 'PedidoId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'PedidoId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  {
    TableName: 'FastFoodPayments',
    KeySchema: [
      { AttributeName: 'PagamentoId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'PagamentoId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  {
    TableName: 'FastFoodCategories',
    KeySchema: [
      { AttributeName: 'CategoriaId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'CategoriaId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }
];

async function createTables() {
  try {
    const isConnected = await tryConnect();
    if (!isConnected) {
      console.error('Não foi possível conectar ao DynamoDB após várias tentativas');
      process.exit(1);
    }

    for (const tableParams of tables) {
      try {
        console.log(`Criando tabela ${tableParams.TableName}...`);
        const result = await client.send(new CreateTableCommand(tableParams));
        console.log(`Created table ${tableParams.TableName}. Table description JSON:`, JSON.stringify(result, null, 2));
      } catch (error) {
        if (error.name === 'ResourceInUseException') {
          console.log(`Tabela ${tableParams.TableName} já existe`);
        } else {
          console.error(`Unable to create table ${tableParams.TableName}. Error JSON:`, JSON.stringify(error, null, 2));
        }
      }
    }
  } catch (error) {
    console.error('Erro fatal:', error);
    process.exit(1);
  }
}

async function initDB() {
  try {
    const createTableParams = {
      TableName: 'FastFoodOrders',
      AttributeDefinitions: [
        { AttributeName: 'PedidoId', AttributeType: 'S' }
      ],
      KeySchema: [
        { AttributeName: 'PedidoId', KeyType: 'HASH' }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    };

    await client.send(new CreateTableCommand(createTableParams));
    console.log('Tabela criada com sucesso.');

    // Adicione dados iniciais, se necessário
    const putParams = {
      TableName: 'FastFoodOrders',
      Item: {
        PedidoId: '1',
        status: 'Recebido'
      }
    };

    await ddbDocClient.send(new PutCommand(putParams));
    console.log('Dados iniciais inseridos com sucesso.');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
}

// Dados iniciais
const seedData = {
  categorias: [
    { CategoriaId: '1', Nome: 'Lanche', Ordem: 1 },
    { CategoriaId: '2', Nome: 'Acompanhamento', Ordem: 2 },
    { CategoriaId: '3', Nome: 'Bebida', Ordem: 3 },
    { CategoriaId: '4', Nome: 'Sobremesa', Ordem: 4 }
  ],
  produtos: [
    { ProdutoId: '1', Nome: 'Hambúrguer', Descricao: 'Hambúrguer clássico', Preco: 15.90, CategoriaId: '1', ImagemUrl: 'hamburger.jpg' },
    { ProdutoId: '2', Nome: 'Batata Frita', Descricao: 'Batata frita crocante', Preco: 8.90, CategoriaId: '2', ImagemUrl: 'batata.jpg' },
    { ProdutoId: '3', Nome: 'Refrigerante', Descricao: 'Refrigerante 500ml', Preco: 6.90, CategoriaId: '3', ImagemUrl: 'refrigerante.jpg' },
    { ProdutoId: '4', Nome: 'Sorvete', Descricao: 'Sorvete de baunilha', Preco: 7.90, CategoriaId: '4', ImagemUrl: 'sorvete.jpg' }
  ]
};

// Função para inserir dados
async function seedDatabase() {
  try {
    console.log("Populando tabela de categorias...");
    for (const categoria of seedData.categorias) {
      await ddbDocClient.send(new PutCommand({
        TableName: `${process.env.ENVIRONMENT || 'dev'}-FastFoodCategories`,
        Item: categoria
      }));
    }
    
    console.log("Populando tabela de produtos...");
    for (const produto of seedData.produtos) {
      await ddbDocClient.send(new PutCommand({
        TableName: `${process.env.ENVIRONMENT || 'dev'}-FastFoodProducts`,
        Item: produto
      }));
    }
    
    console.log("Dados iniciais inseridos com sucesso!");
  } catch (error) {
    console.error("Erro ao popular o banco de dados:", error);
  }
}

createTables();
initDB();
seedDatabase();