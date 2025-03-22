// integration-tests/__tests__/auth-service.fix.js
const axios = require('axios');

test('Serviço de autenticação com CPF válido', async () => {
  // Obter URL da API do ambiente
  const apiUrl = process.env.AUTH_API_URL;

  try {
    // Testar com CPF existente no banco
    const response = await axios.post(`${apiUrl}/auth`, {
      cpf: '529.982.247-25'
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('token');
    console.log('Autenticação bem-sucedida:', response.data);
  } catch (error) {
    console.error('Falha na autenticação:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    expect(true).toBe(false); // Força a falha do teste
  }
});