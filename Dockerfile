# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# A etapa de desenvolvimento pode ser removida para produção
CMD ["npm", "run", "dev"]