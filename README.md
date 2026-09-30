# chamados-frontend

Repositório front-end do projeto de chamados.

## Descrição

- Aplicação para acompanhamento e gerenciamento de chamados realizados por técnicos de monitoramento NOC.

## Funcionalidades

- Cadastrar, listar, editar, excluir e pesquisar chamados.
- Cadastrar, listar, editar, excluir e pesquisar por equipamentos.
- Listar e editar técnicos do sistema.
- Autenticação JWT.

## Tecnologias utilizadas

- Next.js 16 (App Router) e React 19
- Claude Code (front-end feito assistido por i.a)
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- TanStack Query
- NextAuth
- React Hook Form e Zod
- Docker e Docker Compose

## [Repositório back-end](https://github.com/BrenoDev00/chamados-backend)

### Para rodar toda a aplicação, é necessário incluir um arquivo docker-compose.yaml (infra) e um arquivo initialize.sh (instancia os containers da aplicação) na raiz da aplicação e executar o script initialize. Também é necessário incluir um arquivo .env conforme exemplos do .env.example na raiz de cada repositório, e preencher as variáveis de ambiente.

### script initialize:
#!/bin/bash

echo "Inicializando aplicação..."

docker compose --env-file backend/.env --env-file frontend/.env up --build

### docker-compose:
services:
   ----------------------------------------------------------------------------
   Serviço do Banco de Dados PostgreSQL
   ----------------------------------------------------------------------------
  postgres-db:
    image: postgres:16-alpine
    container_name: postgres-db
    restart: always
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 5s
      timeout: 5s
      retries: 5

   ----------------------------------------------------------------------------
   Serviço da Aplicação Spring Boot
   ----------------------------------------------------------------------------
  spring-app:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: spring-app
    restart: always
    ports:
      - "8080:8080"
    volumes:
      - .:/build
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres-db:5432/${DB_NAME}
      - SPRING_DATASOURCE_USERNAME=${DB_USER}
      - SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}
      - SPRING_PROFILES_ACTIVE=${PROFILE_ACTIVE}
      - SWAGGER_SPECIFICATION_ENABLED=${SWAGGER_SPECIFICATION_ENABLED}
      - SWAGGER_UI_ENABLED=${SWAGGER_UI_ENABLED}
      - JWT_SECRET=${JWT_SECRET}
      - SPRING_JPA_HIBERNATE_DDL_AUTO=update
    depends_on:
      postgres-db:
        condition: service_healthy

   ----------------------------------------------------------------------------
   Serviço da Aplicação Next.js
   ----------------------------------------------------------------------------
  next-app:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: next-app
    restart: always
    ports:
      - "3000:3000"
    environment:
      - API_URL=${API_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - spring-app

volumes:
  postgres_data:
