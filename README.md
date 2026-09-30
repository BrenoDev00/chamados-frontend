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

## Como executar a aplicação full stack

É necessário incluir um arquivo [docker-compose.yaml](./docs/infra/docker-compose.txt) (infra) e um arquivo [initialize.sh](./docs/infra/initialize.txt) (instancia os containers da aplicação) na raiz da aplicação e executar o script initialize. Também é necessário incluir um arquivo .env conforme exemplos dos .env.example na raiz de cada repositório, e preencher as variáveis de ambiente.
