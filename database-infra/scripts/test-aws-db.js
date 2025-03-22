// database-infra/scripts/test-aws-db.js
const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');

// Configuração para AWS na nuvem (sem endpoint)
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
  // Sem endpoint local, será usado o endpoint da AWS
});

async function testAWSConnection() {
  try {
    console.log('Tentando conectar ao DynamoDB na AWS...');
    const { TableNames } = await client.send(new ListTablesCommand({}));
    console.log('Conexão bem sucedida! Tabelas encontradas:', TableNames);
    
    // Verificar tabelas específicas do projeto
    const fastFoodTables = TableNames.filter(name => name.includes('FastFood'));
    if (fastFoodTables.length > 0) {
      console.log('Tabelas do projeto encontradas:', fastFoodTables);
    } else {
      console.log('Nenhuma tabela do projeto encontrada. As tabelas precisam ser criadas.');
    }
  } catch (error) {
    console.error('Erro ao conectar ao DynamoDB AWS:', error);
    
    if (error.Code === 'UnrecognizedClientException') {
      console.log('\nPossível problema de credenciais. Verifique suas credenciais da AWS:');
      console.log('1. Configure usando: aws configure');
      console.log('2. Ou defina as variáveis de ambiente: AWS_ACCESS_KEY_ID e AWS_SECRET_ACCESS_KEY');
    }
  }
}

testAWSConnection();