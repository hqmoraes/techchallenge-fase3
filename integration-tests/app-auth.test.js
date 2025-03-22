// integration-tests/app-auth.test.js
const axios = require('axios');

describe('Integração App-Autenticação', () => {
  test('App deve se conectar ao serviço de autenticação', async () => {
    const authApiUrl = process.env.AUTH_API_URL;
    const testClientCPF = '529.982.247-25';

    try {
      const response = await axios.post(`${authApiUrl}/auth`, {
        cpf: testClientCPF
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
    } catch (error) {
      console.error('Falha na autenticação:', error.message);
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Resposta:", error.response.data);
      }
      expect(true).toBe(false); // Força a falha do teste
    }
  });
});