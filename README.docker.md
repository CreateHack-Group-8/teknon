# Docker Setup Guide

Este guia explica como executar a Vulnerability Assistance Platform usando Docker e Docker Compose.

## Pré-requisitos

- Docker instalado
- Docker Compose instalado

## Configuração Rápida

### 1. Executar com Docker Compose (Produção)

```bash
# Construir e iniciar todos os serviços
docker-compose up --build

# Executar em background
docker-compose up -d --build
```

A aplicação estará disponível em:
- **API**: http://localhost:3001
- **Swagger Documentation**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

### 2. Executar apenas PostgreSQL (Desenvolvimento)

Se você quiser executar apenas o banco PostgreSQL e rodar a aplicação localmente:

```bash
# Iniciar apenas PostgreSQL
docker-compose -f docker-compose.dev.yml up postgres -d

# Configurar variáveis de ambiente
export DATABASE_URL="postgresql://postgres:postgres123@localhost:5433/vulnerability_platform_dev"

# Executar migrações e seed
npm run prisma:migrate
npm run prisma:seed

# Iniciar aplicação localmente
npm start
```

### 3. Prisma Studio com Docker

Para acessar o Prisma Studio via Docker:

```bash
# Iniciar PostgreSQL e Prisma Studio
docker-compose -f docker-compose.dev.yml up --build

# Ou apenas Prisma Studio (se PostgreSQL já estiver rodando)
docker-compose -f docker-compose.dev.yml up prisma-studio --build
```

Prisma Studio estará disponível em: http://localhost:5555

## Configurações

### Variáveis de Ambiente

As seguintes variáveis são configuradas automaticamente no Docker:

- `NODE_ENV=production`
- `PORT=3001`
- `DATABASE_URL=postgresql://postgres:postgres123@postgres:5432/vulnerability_platform`
- `JWT_SECRET=your_jwt_secret_here_change_in_production`

### Portas Utilizadas

- **3001**: API da aplicação
- **5432**: PostgreSQL (produção)
- **5433**: PostgreSQL (desenvolvimento)
- **5555**: Prisma Studio

## Comandos Úteis

### Gerenciamento de Containers

```bash
# Ver logs da aplicação
docker-compose logs app

# Ver logs do PostgreSQL
docker-compose logs postgres

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (CUIDADO: remove dados)
docker-compose down -v

# Reconstruir containers
docker-compose up --build --force-recreate
```

### Banco de Dados

```bash
# Conectar ao PostgreSQL via Docker
docker exec -it vulnerability_platform_db psql -U postgres -d vulnerability_platform

# Backup do banco
docker exec vulnerability_platform_db pg_dump -U postgres vulnerability_platform > backup.sql

# Restaurar backup
docker exec -i vulnerability_platform_db psql -U postgres vulnerability_platform < backup.sql
```

### Desenvolvimento

```bash
# Executar comandos Prisma no container
docker-compose exec app npm run prisma:migrate
docker-compose exec app npm run prisma:seed
docker-compose exec app npm run prisma:studio

# Acessar shell do container
docker-compose exec app sh
```

## Estrutura dos Arquivos Docker

- `docker-compose.yml`: Configuração para produção
- `docker-compose.dev.yml`: Configuração para desenvolvimento
- `Dockerfile`: Imagem da aplicação Node.js
- `Dockerfile.dev`: Imagem para ferramentas de desenvolvimento
- `.dockerignore`: Arquivos ignorados no build
- `init-db.sql`: Script de inicialização do PostgreSQL

## Troubleshooting

### Porta já em uso
Se encontrar erro de porta em uso:
```bash
# Verificar processos usando a porta
lsof -i :3001
lsof -i :5432

# Parar containers existentes
docker-compose down
```

### Problemas de conexão com banco
```bash
# Verificar se PostgreSQL está saudável
docker-compose ps
docker-compose logs postgres

# Recriar banco de dados
docker-compose down -v
docker-compose up postgres -d
```

### Reset completo
```bash
# Parar tudo e limpar
docker-compose down -v
docker system prune -f
docker-compose up --build
```

## Segurança

⚠️ **IMPORTANTE**: Antes de usar em produção:

1. Altere as senhas padrão no arquivo `.env.docker`
2. Configure um `JWT_SECRET` seguro
3. Use volumes nomeados para persistência de dados
4. Configure backup automático do PostgreSQL
5. Use HTTPS em produção
