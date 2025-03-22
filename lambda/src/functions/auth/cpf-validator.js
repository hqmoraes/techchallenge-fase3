// lambda/src/functions/auth/cpf-validator.js
/**
 * Valida um número de CPF
 * @param {string} cpf - CPF a ser validado (pode conter pontos e traço)
 * @returns {boolean} - true se válido, false se inválido
 */
function validateCPF(cpf) {
  // Limpar formatação
  cpf = cpf.replace(/[^\d]/g, '');
  
  // Verificar se tem 11 dígitos
  if (cpf.length !== 11) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  
  let resto = soma % 11;
  let dv1 = resto < 2 ? 0 : 11 - resto;
  
  if (parseInt(cpf.charAt(9)) !== dv1) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  
  resto = soma % 11;
  let dv2 = resto < 2 ? 0 : 11 - resto;
  
  return parseInt(cpf.charAt(10)) === dv2;
}

module.exports = { validateCPF };