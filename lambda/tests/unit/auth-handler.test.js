// lambda/tests/unit/auth-handler.test.js
const { handler } = require('../../src/functions/auth/index');
const { ddbDocClient } = require('../../src/utils/dynamo-client');
const { validateCPF } = require('../../src/functions/auth/cpf-validator');
const { generateToken } = require('../../src/functions/auth/token-generator');

// Mock dos módulos
jest.mock('../../src/utils/dynamo-client', () => ({
  ddbDocClient: {
    send: jest.fn()
  }
}));

jest.mock('../../src/functions/auth/cpf-validator', () => ({
  validateCPF: jest.fn()
}));

jest.mock('../../src/functions/auth/token-generator', () => ({
  generateToken: jest.fn().mockReturnValue('mocked-jwt-token')
}));

describe('Auth Lambda Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve retornar erro quando CPF não é fornecido', async () => {
    const event = { body: JSON.stringify({}) };
    
    const response = await handler(event);
    
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toContain('CPF é obrigatório');
  });

  test('Deve retornar erro quando CPF é inválido', async () => {
    validateCPF.mockReturnValue(false);
    
    const event = { body: JSON.stringify({ cpf: '12345678901' }) };
    
    const response = await handler(event);
    
    expect(validateCPF).toHaveBeenCalledWith('12345678901');
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toContain('CPF inválido');
  });

  test('Deve retornar 404 quando cliente não é encontrado', async () => {
    validateCPF.mockReturnValue(true);
    ddbDocClient.send.mockResolvedValue({ Items: [] });
    
    const event = { body: JSON.stringify({ cpf: '52998224725' }) };
    
    const response = await handler(event);
    
    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body).message).toContain('Cliente não encontrado');
  });

  test('Deve retornar token quando autenticação é bem-sucedida', async () => {
    validateCPF.mockReturnValue(true);
    
    const mockCliente = {
      ClienteId: '123',
      nome: 'Test User',
      email: 'test@example.com',
      CPF: '52998224725'
    };
    
    ddbDocClient.send.mockResolvedValue({ Items: [mockCliente] });
    
    const event = { body: JSON.stringify({ cpf: '52998224725' }) };
    
    const response = await handler(event);
    
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    
    expect(body.token).toBe('mocked-jwt-token');
    expect(body.cliente.id).toBe('123');
    expect(body.cliente.nome).toBe('Test User');
    expect(generateToken).toHaveBeenCalledWith(mockCliente);
  });
});