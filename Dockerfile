FROM node:20-slim

# Dependências básicas de sistema (certificados e utilitários)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instala dependências do projeto
COPY package*.json ./
RUN npm ci --only=production

# Copia fontes e templates para dentro da imagem
COPY assets/ ./assets/
COPY src/ ./src/

# Diretórios para montagem de volumes
RUN mkdir -p /app/input /app/output

ENV NODE_ENV=production

ENTRYPOINT ["node", "src/index.js"]
CMD ["input/sample.json"]
