// lambda/src/functions/auth/token-generator.js
const jwt = require('jsonwebtoken');

/**
 * Gera um token JWT para autenticação do cliente
 * @param {Object} cliente - Dados do cliente
 * @returns {string} - Token JWT gerado
 */
function generateToken(cliente) {
  const secretKey = process.env.JWT_SECRET || 'fast-food-auth-secret';
  const expiresIn = process.env.TOKEN_EXPIRY || '1d';
  
  const payload = {
    sub: cliente.ClienteId,
    nome: cliente.nome,
    cpf: cliente.CPF,
    iat: Math.floor(Date.now() / 1000)
  };
  
  return jwt.sign(payload, secretKey, { expiresIn });
}

module.exports = { generateToken };