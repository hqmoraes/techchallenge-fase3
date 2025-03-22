// fix-lambda-function.js
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({ region: 'us-east-1' });

// Função Lambda que verifica cliente pelo CPF
const lambdaCode = `
exports.handler = async (event) => {
  console.log('Evento recebido:', event);
  
  try {
    const AWS = require('aws-sdk');
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    
    // Extrair CPF da requisição
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (e) {
      body = {};
    }
    
    const cpf = body.cpf;
    if (!cpf) {
      return formatResponse(400, { message: 'CPF é obrigatório' });
    }
    
    // Buscar cliente por CPF
    const result = await dynamoDB.scan({
      TableName: 'dev-FastFoodClients',
      FilterExpression: 'cpf = :cpf',
      ExpressionAttributeValues: {
        ':cpf': cpf
      }
    }).promise();
    
    if (result.Items && result.Items.length > 0) {
      return formatResponse(200, {
        authenticated: true,
        message: 'Autenticação bem-sucedida',
        cliente: result.Items[0]
      });
    }
    
    return formatResponse(404, { message: 'Cliente não encontrado' });
  } catch (error) {
    console.error('Erro:', error);
    return formatResponse(500, { message: 'Erro interno do servidor' });
  }
};

function formatResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(body)
  };
}
`;

// Atualizar a função Lambda
async function atualizarLambda() {
  try {
    // Obter ID da função Lambda
    const functions = await lambda.listFunctions().promise();
    const authFunction = functions.Functions.find(f => 
      f.FunctionName.includes('fastfood') && f.FunctionName.includes('auth')
    );
    
    if (!authFunction) {
      console.error('Função Lambda de autenticação não encontrada');
      return;
    }
    
    // Atualizar código
    await lambda.updateFunctionCode({
      FunctionName: authFunction.FunctionName,
      ZipFile: Buffer.from(`
        exports.handler = ${lambdaCode}
      `)
    }).promise();
    
    console.log(`Função Lambda ${authFunction.FunctionName} atualizada com sucesso`);
  } catch (error) {
    console.error('Erro ao atualizar Lambda:', error);
  }
}

atualizarLambda();

resource "aws_iam_policy" "dynamodb_policy" {
  name        = "${var.environment}-fastfood-dynamodb-policy"
  description = "Permite acesso às tabelas DynamoDB do sistema Fast Food"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Effect = "Allow"
        Resource = [
          data.terraform_remoteresource "aws_iam_policy" "dynamodb_policy" {
  name        = "${var.environment}-fastfood-dynamodb-policy"
  description = "Permite acesso às tabelas DynamoDB do sistema Fast Food"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Effect = "Allow"
        Resource = [
          data.terraform_remote