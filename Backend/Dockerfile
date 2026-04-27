FROM node:22-alpine

# Instala dependências de sistema para bcrypt/multer
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copia manifesto e instala dependências primeiro (cache layer)
COPY package*.json ./
RUN npm ci --omit=dev

# Copia código-fonte
COPY . .

# Diretório de uploads
RUN mkdir -p /app/uploads && chown node:node /app/uploads

USER node

EXPOSE 3000

# Executa migração e depois inicia o servidor
CMD ["sh", "-c", "node src/database/migrate.js && node src/server.js"]
