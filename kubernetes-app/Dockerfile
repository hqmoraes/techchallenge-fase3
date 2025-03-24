FROM node:18-alpine

WORKDIR /app

# Copiar apenas os arquivos de configuração primeiro
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o código fonte
COPY . .

# Expor a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]