// src/functions/auth/index.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');

// Crie cliente DynamoDB diretamente (sem depender de módulo externo)
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Função para validar CPF simples
function validateCPF(cpf) {
  // Implementação básica para ilustrar
  return cpf && cpf.length >= 11;
}

// Função para gerar token simples
function generateToken(cliente) {
  return `mock-token-${Date.now()}-${cliente.ClienteId}`;
}

exports.handler = async (event) => {
  console.log('Evento recebido:', JSON.stringify(event));
  try {
    // Parse do corpo da requisição com validação
    let body;
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (e) {
      console.error('Erro ao fazer parse do JSON:', e);
      return formatResponse(400, { message: 'Body inválido' });
    }
    
    const { cpf } = body;
    console.log('CPF recebido:', cpf);
    
    // Validação do input
    if (!cpf) {
      return formatResponse(400, { message: 'CPF é obrigatório' });
    }
    
    console.log('Validando CPF:', cpf);
    // Validar formato do CPF
    if (!validateCPF(cpf)) {
      return formatResponse(400, { message: 'CPF inválido' });
    }
    
    console.log('Buscando cliente por CPF');
    console.log('Tabela:', process.env.CLIENTS_TABLE || 'FastFoodClients');
    
    // Buscar cliente pelo CPF
    try {
      const cliente = await findClienteByCPF(cpf);
      
      if (!cliente) {
        console.log('Cliente não encontrado para o CPF:', cpf);
        return formatResponse(404, { message: 'Cliente não encontrado' });
      }
      
      console.log('Cliente encontrado:', JSON.stringify(cliente));
      console.log('Gerando token');
      // Gerar token JWT
      const token = generateToken(cliente);
      
      // Retornar resposta com token
      return formatResponse(200, { 
        message: 'Autenticação bem-sucedida',
        token,
        cliente: {
          id: cliente.ClienteId,
          nome: cliente.nome || 'Nome não disponível',
          email: cliente.email || 'Email não disponível'
        }
      });
    } catch (dbError) {
      console.error('Erro ao consultar o DynamoDB:', dbError);
      return formatResponse(500, { 
        message: 'Erro ao consultar o banco de dados',
        error: dbError.message 
      });
    }
  } catch (error) {
    console.error('Erro durante autenticação:', error);
    return formatResponse(500, { 
      message: 'Erro interno no servidor',
      error: error.message
    });
  }
};

// Função para buscar cliente por CPF
async function findClienteByCPF(cpf) {
  try {
    const params = {
      TableName: process.env.CLIENTS_TABLE || 'dev-FastFoodClients',
      IndexName: 'CPFIndex',
      KeyConditionExpression: "CPF = :cpf",
      ExpressionAttributeValues: {
        ":cpf": cpf
      }
    };
    
    console.log('Parâmetros da consulta:', JSON.stringify(params));
    const response = await ddbDocClient.send(new QueryCommand(params));
    console.log('Resposta do DynamoDB:', JSON.stringify(response));
    return response.Items && response.Items.length > 0 ? response.Items[0] : null;
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    throw error;
  }
}

// Formatar resposta para API Gateway
function formatResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization'
    },
    body: JSON.stringify(body)
  };
}
