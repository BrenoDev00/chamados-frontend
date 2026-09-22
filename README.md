# chamados-frontend
Repositório front-end do projeto de chamados.

## Descrição
- Aplicação para acompanhamento e gerenciamento de chamados realizados por técnicos de monitoramento NOC.

## Funcionalidades
- Cadastrar, listar, editar, excluir e pesquisar chamados.
- Cadastrar, listar, editar, excluir e pesquisar por equipamentos.
- Listar e editar técnicos do sistema.
- Autenticação JWT.

## Tecnologias a serem utilizadas
- React/Next
- Tailwind CSS
- Shadcn UI
- TypeScript
- Tanstack Query
- Next Auth
- Docker e Docker Compose
- Cypress para testes E2E (opcional)

## Como executar

### Pré-requisitos
- Node.js 20.9+ (recomendado 24)
- API do back-end em execução

### Desenvolvimento
```bash
cp .env.example .env.local   # preencha NEXTAUTH_SECRET (openssl rand -base64 32)
npm install
npm run dev
```
Acesse http://localhost:3000.

### Scripts
- `npm run dev`: servidor de desenvolvimento
- `npm run build`: build de produção
- `npm run lint`: análise estática com ESLint
- `npm run typecheck`: checagem de tipos do TypeScript

### Docker
O serviço `next-app` está no `docker-compose.yaml` da raiz do projeto e exige as variáveis `NEXTAUTH_URL` e `NEXTAUTH_SECRET`.

## Arquitetura
- As requisições do navegador passam pela rota `/api/backend/*`, que encaminha para a API Spring anexando o token JWT da sessão. Assim o token não fica exposto no cliente e a API não precisa de CORS.
- A proteção de rotas é feita em `src/proxy.ts`, que redireciona para `/login` quando não há sessão válida.
