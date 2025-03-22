// lambda/tests/unit/cpf-validator.test.js
const { validateCPF } = require('../../src/functions/auth/cpf-validator');

describe('Validador de CPF', () => {
  test('Deve validar um CPF correto', () => {
    expect(validateCPF('529.982.247-25')).toBe(true);
  });

  test('Deve validar um CPF correto sem formatação', () => {
    expect(validateCPF('52998224725')).toBe(true);
  });

  test('Deve rejeitar CPF com menos de 11 dígitos', () => {
    expect(validateCPF('1234567890')).toBe(false);
  });

  test('Deve rejeitar CPF com dígitos iguais', () => {
    expect(validateCPF('11111111111')).toBe(false);
  });

  test('Deve rejeitar CPF com dígito verificador inválido', () => {
    expect(validateCPF('12345678901')).toBe(false);
  });
});