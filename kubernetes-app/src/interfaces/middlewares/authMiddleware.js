// kubernetes-app/src/interfaces/middlewares/authMiddleware.js
const axios = require('axios');

async function authMiddleware(req, res, next) {
  try {
    const { cpf } = req.body;
    
    if (!cpf) {
      return next(); // Permite requisições sem CPF (para usuários não identificados)
    }
    
    // Chama o endpoint de autenticação Lambda via API Gateway
    const authResponse = await axios.post(process.env.AUTH_API_URL, { cpf });
    
    if (authResponse.status === 200) {
      // Adiciona as informações do cliente à requisição
      req.cliente = authResponse.data.cliente;
      next();
    } else {
      return res.status(authResponse.status).json({ message: 'Falha na autenticação' });
    }
  } catch (error) {
    console.error('Erro ao autenticar:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}

module.exports = authMiddleware;