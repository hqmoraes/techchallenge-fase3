# Use a imagem base oficial do Node.js
FROM node:20

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante do código da aplicação para o diretório de trabalho
COPY . .

# Exponha a porta que a aplicação irá rodar
EXPOSE 3000

# Defina as variáveis de ambiente necessárias
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar a aplicação
CMD ["sh", "-c", "npm run init-db && npm start"]