/**
 * Utilitário para acesso a secrets via AWS Secrets Manager
 * Tech Challenge Fast Food - Fase 3
 */
const AWS = require('aws-sdk');

// AWS SDK usa automaticamente as credenciais do Pod via IRSA
const secretsManager = new AWS.SecretsManager({
  region: process.env.AWS_REGION || 'us-east-1'
});

/**
 * Obtém os dados de um secret do AWS Secrets Manager
 * @param {string} secretArn - ARN do secret
 * @returns {Promise<object>} - Objeto JSON com os dados do secret
 */
async function getSecret(secretArn) {
  try {
    const data = await secretsManager.getSecretValue({
      SecretId: secretArn
    }).promise();
    
    if ('SecretString' in data) {
      return JSON.parse(data.SecretString);
    }
    
    throw new Error('Secret não contém uma string');
  } catch (error) {
    console.error('Erro ao obter secret:', error);
    throw error;
  }
}

/**
 * Obtém as configurações de banco de dados do Secret Manager
 * @returns {Promise<object>} Configurações do DynamoDB
 */
async function getDatabaseConfig() {
  const secretArn = process.env.DATABASE_SECRET_ARN;
  if (!secretArn) {
    throw new Error('DATABASE_SECRET_ARN não definido');
  }
  
  return await getSecret(secretArn);
}

/**
 * Obtém as credenciais de APIs externas
 * @returns {Promise<object>} Credenciais para APIs externas
 */
async function getApiCredentials() {
  const secretArn = process.env.API_SECRET_ARN;
  if (!secretArn) {
    throw new Error('API_SECRET_ARN não definido');
  }
  
  return await getSecret(secretArn);
}

module.exports = {
  getSecret,
  getDatabaseConfig,
  getApiCredentials
};
