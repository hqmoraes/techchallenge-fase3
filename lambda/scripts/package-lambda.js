// Alternativamente, criar um script de empacotamento dedicado
// scripts/package-lambda.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Criar diretório temporário
console.log('Criando pacote Lambda...');
const tempDir = path.join(__dirname, '../dist');
if (fs.existsSync(tempDir)) {
  execSync(`rm -rf ${tempDir}`);
}
fs.mkdirSync(tempDir, { recursive: true });

// Copiar arquivos relevantes
execSync(`cp -r ../src ${tempDir}/`);
execSync(`cp package.json ${tempDir}/`);

// Instalar dependências de produção
console.log('Instalando dependências...');
execSync('npm install --production', { cwd: tempDir });

// Criar ZIP
console.log('Criando arquivo ZIP...');
execSync(`cd ${tempDir} && zip -r ../terraform/lambda-package.zip .`);
console.log('Pacote Lambda criado com sucesso!');