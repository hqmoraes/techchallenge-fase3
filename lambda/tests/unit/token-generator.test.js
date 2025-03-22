// lambda/tests/unit/token-generator.test.js
const { generateToken } = require('../../src/functions/auth/token-generator');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('token-mock')
}));

describe('Gerador de Token', () => {
  const mockCliente = {
    ClienteId: '123',
    nome: 'Test User',
    CPF: '52998224725'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve gerar um token JWT válido', () => {
    const token = generateToken(mockCliente);
    
    expect(token).toBe('token-mock');
    expect(jwt.sign).toHaveBeenCalledTimes(1);
    
    const [payload, secret, options] = jwt.sign.mock.calls[0];
    expect(payload.sub).toBe('123');
    expect(payload.nome).toBe('Test User');
    expect(payload.cpf).toBe('52998224725');
    expect(payload.iat).toBeDefined();
    
    expect(secret).toBeDefined();
    expect(options.expiresIn).toBeDefined();
  });
});