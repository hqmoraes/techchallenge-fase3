// kubernetes-app/src/infra/config/credentials.js

const AWS = require('aws-sdk');
const fs = require('fs');

// AWS SDK vai automaticamente usar as credenciais do Pod via IRSA
const secretsManager = new AWS.SecretsManager({ region: process.env.AWS_REGION || 'us-east-1' });

async function loadSecrets() {
  try {
    // Se estamos em desenvolvimento local, não usamos o Secrets Manager
    if (process.env.NODE_ENV === 'development') {
      return {
        database: {
          clients_table: process.env.CLIENTS_TABLE,
          products_table: process.env.PRODUCTS_TABLE,
          categories_table: process.env.CATEGORIES_TABLE,
          orders_table: process.env.ORDERS_TABLE,
          payments_table: process.env.PAYMENTS_TABLE
        },
        external: {
          mercado_pago_access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
          jwt_secret: process.env.JWT_SECRET
        }
      };
    }

    // Em ambiente Kubernetes, verificamos se os secrets foram injetados pelo init container
    if (fs.existsSync('/secrets/database.json') && fs.existsSync('/secrets/external-api.json')) {
      const databaseSecrets = JSON.parse(fs.readFileSync('/secrets/database.json', 'utf8'));
      const externalSecrets = JSON.parse(fs.readFileSync('/secrets/external-api.json', 'utf8'));
      
      return {
        database: databaseSecrets,
        external: externalSecrets
      };
    }

    // Se não encontramos os arquivos, tentamos acessar diretamente o Secrets Manager
    const databaseSecretData = await secretsManager.getSecretValue({
      SecretId: `${process.env.ENVIRONMENT || 'dev'}/fastfood/database`
    }).promise();
    
    const externalSecretData = await secretsManager.getSecretValue({
      SecretId: `${process.env.ENVIRONMENT || 'dev'}/fastfood/external-apis`
    }).promise();
    
    return {
      database: JSON.parse(databaseSecretData.SecretString),
      external: JSON.parse(externalSecretData.SecretString)
    };
  } catch (error) {
    console.error('Erro ao carregar secrets:', error);
    throw new Error('Não foi possível carregar as credenciais necessárias');
  }
}

module.exports = { loadSecrets };