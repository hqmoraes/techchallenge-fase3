// Microsserviço de Autenticação - Alinhado com Clean Architecture
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

// Camada de infraestrutura - Acesso a serviços externos
const dynamodb = new AWS.DynamoDB.DocumentClient();
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
const CLIENTS_TABLE = process.env.CLIENTS_TABLE;

// Camada de aplicação - Lógica de negócio
class AuthService {
  static async authenticate(cpf, senha) {
    // Buscar cliente pelo CPF
    const params = {
      TableName: CLIENTS_TABLE,
      IndexName: 'CPFIndex',
      KeyConditionExpression: 'CPF = :cpf',
      ExpressionAttributeValues: {
        ':cpf': cpf
      }
    };
    
    const result = await dynamodb.query(params).promise();
    
    if (result.Items.length === 0) {
      throw new Error('Cliente não encontrado');
    }
    
    const cliente = result.Items[0];
    
    // Em produção, verificar hash da senha
    if (senha !== 'senha123') { // Simplificado para o exemplo
      throw new Error('Senha incorreta');
    }
    
    // Gerar token JWT
    return jwt.sign(
      { 
        clienteId: cliente.ClienteId,
        cpf: cliente.CPF,
        nome: cliente.nome
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  }
}

// Adaptador de API - Camada de interface com usuário
exports.handler = async (event) => {
  console.log('Evento recebido:', JSON.stringify(event));
  
  try {
    const body = JSON.parse(event.body || '{}');
    const { cpf, senha } = body;
    
    if (!cpf || !senha) {
      return {
        statusCode: 400,
        body: JSON.stringify({ mensagem: 'CPF e senha são obrigatórios' })
      };
    }
    
    try {
      const token = await AuthService.authenticate(cpf, senha);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          mensagem: 'Autenticação bem-sucedida',
          token
        })
      };
    } catch (authError) {
      return {
        statusCode: 401,
        body: JSON.stringify({ mensagem: 'Credenciais inválidas' })
      };
    }
  } catch (erro) {
    console.error('Erro:', erro);
    return {
      statusCode: 500,
      body: JSON.stringify({ mensagem: 'Erro interno' })
    };
  }
};
