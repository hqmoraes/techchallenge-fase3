// src/functions/auth/index.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { validateCPF } = require('./cpf-validator');
const { generateToken } = require('./token-generator');

// Crie cliente DynamoDB diretamente (sem depender de módulo externo)
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
});
const ddbDocClient = DynamoDBDocumentClient.from(client);

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
    // Buscar cliente pelo CPF
    const cliente = await findClienteByCPF(cpf);
    
    if (!cliente) {
      return formatResponse(404, { message: 'Cliente não encontrado' });
    }
    
    console.log('Cliente encontrado, gerando token');
    // Gerar token JWT
    const token = generateToken(cliente);
    
    // Retornar resposta com token
    return formatResponse(200, { 
      message: 'Autenticação bem-sucedida',
      token,
      cliente: {
        id: cliente.ClienteId,
        nome: cliente.nome,
        email: cliente.email
      }
    });
  } catch (error) {
    console.error('Erro durante autenticação:', error);
    return formatResponse(500, { message: 'Erro interno no servidor' });
  }
};

// Função para buscar cliente por CPF
async function findClienteByCPF(cpf) {
  try {
    const params = {
      TableName: process.env.CLIENTS_TABLE || 'FastFoodClients',
      IndexName: 'CPFIndex',
      KeyConditionExpression: 'CPF = :cpf',
      ExpressionAttributeValues: {
        ':cpf': cpf
      }
    };
    
    console.log('Parâmetros da consulta:', JSON.stringify(params));
    const { Items } = await ddbDocClient.send(new QueryCommand(params));
    return Items && Items.length > 0 ? Items[0] : null;
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