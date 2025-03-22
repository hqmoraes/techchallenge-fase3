const dotenv = require('dotenv');

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  maxWorkers: 1, // Adicione esta linha para rodar os testes sequencialmente
  verbose: true, // Adicione esta linha para ver mais detalhes durante a execução dos testes
  silent: false, // Adicione esta linha para garantir que os logs não sejam suprimidos
  setupFiles: ['<rootDir>/tests/setup.js'], // Adicione esta linha para carregar as variáveis de ambiente
  globals: {
    API_URL: 'http://fastfood.wecando.click'
  }
};