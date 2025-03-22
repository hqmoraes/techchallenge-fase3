// database-infra/scripts/create-tables.js
const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');

// Use variável de ambiente para determinar se é local ou AWS
const isLocal = process.env.DYNAMODB_LOCAL === 'true';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  ...(isLocal && { 
    endpoint: 'http://localhost:8000',
    credentials: { accessKeyId: 'local', secretAccessKey: 'local' }
  })
});

// Definições das tabelas com configurações completas
const tableDefinitions = [
  {
    TableName: 'FastFoodClients',
    KeySchema: [{ AttributeName: 'ClienteId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'ClienteId', AttributeType: 'S' },
      { AttributeName: 'CPF', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [{
      IndexName: 'CPFIndex',
      KeySchema: [{ AttributeName: 'CPF', KeyType: 'HASH' }],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }],
    BillingMode: 'PROVISIONED',
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
  },
  // Adicione outras definições de tabela conforme necessário
];

async function createTable(tableDefinition) {
  try {
    console.log(`Criando tabela ${tableDefinition.TableName}...`);
    await client.send(new CreateTableCommand(tableDefinition));
    console.log(`✅ Tabela ${tableDefinition.TableName} criada com sucesso`);
    return true;
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log(`⚠️ Tabela ${tableDefinition.TableName} já existe`);
      return true;
    }
    console.error(`❌ Erro ao criar tabela ${tableDefinition.TableName}:`, error);
    return false;
  }
}

async function createAllTables() {
  for (const tableDef of tableDefinitions) {
    await createTable(tableDef);
  }
}

createAllTables();