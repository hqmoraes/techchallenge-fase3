const { DynamoDBClient, ListTablesCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000'
});

// Tabelas e índices esperados
const expectedTables = {
  'FastFoodClients': ['CPFIndex'],
  'FastFoodProducts': ['CategoriaIndex'],
  'FastFoodOrders': ['ClienteIndex', 'StatusIndex'],
  'FastFoodPayments': ['PedidoIndex'],
  'FastFoodCategories': []
};

async function validateTables() {
  try {
    // Listar todas as tabelas
    const { TableNames } = await client.send(new ListTablesCommand({}));
    console.log('Tabelas encontradas:', TableNames);
    
    // Verificar se todas as tabelas esperadas existem
    for (const tableName of Object.keys(expectedTables)) {
      if (!TableNames.includes(tableName)) {
        console.error(`❌ Tabela ${tableName} não encontrada!`);
        continue;
      }
      
      // Verificar índices da tabela
      const { Table } = await client.send(new DescribeTableCommand({ TableName: tableName }));
      console.log(`✅ Tabela ${tableName} existe`);
      
      // Verificar GSIs
      const expectedIndexes = expectedTables[tableName];
      const tableIndexes = Table.GlobalSecondaryIndexes?.map(idx => idx.IndexName) || [];
      
      for (const indexName of expectedIndexes) {
        if (tableIndexes.includes(indexName)) {
          console.log(`  ✅ Índice ${indexName} existe em ${tableName}`);
        } else {
          console.error(`  ❌ Índice ${indexName} NÃO encontrado em ${tableName}`);
        }
      }
    }
  } catch (error) {
    console.error('Erro ao validar tabelas:', error);
  }
}

validateTables();