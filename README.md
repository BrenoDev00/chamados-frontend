# chamados-frontend
Repositório front-end do projeto de chamados.

## Descrição
- Aplicação para acompanhamento e gerenciamento de chamados realizados por técnicos de monitoramento NOC.
- Pensada para uso em desktop e notebook.

## Funcionalidades
- Autenticação com e-mail institucional e senha (JWT emitido pela API).
- Chamados: listar, cadastrar, editar, atualizar status e pesquisar por ID do chamado ou ID Sefit do equipamento.
- Equipamentos: listar, cadastrar, editar, excluir e pesquisar por ID Sefit ou local/via.
- Técnicos: listar e editar nome, e-mail e turno.

### Regras de negócio no front-end
- Chamados com status **Em andamento** não possuem data e hora de fim; ao alterar o status para **Finalizado**, esses campos passam a ser obrigatórios.
- A data/hora de fim não pode ser anterior à data/hora de início.
- O técnico que abriu e o técnico que finalizou o chamado são registrados pela API a partir do usuário autenticado.
- Excluir um equipamento também exclui os chamados vinculados a ele (a confirmação avisa sobre isso).
- Ao alterar o próprio e-mail, o técnico é desconectado e deve entrar novamente com o novo e-mail.

## Tecnologias utilizadas
- Next.js 16 (App Router) e React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- TanStack Query
- NextAuth
- React Hook Form e Zod
- Docker e Docker Compose

## Como executar

### Pré-requisitos
- Node.js 20.9+ (recomendado 24)
- API do back-end em execução (padrão: http://localhost:8080)

### Variáveis de ambiente
| Variável | Descrição |
|---|---|
| `API_URL` | URL base da API Spring, acessada apenas pelo servidor Next |
| `NEXTAUTH_URL` | URL pública do front-end |
| `NEXTAUTH_SECRET` | Chave usada para assinar a sessão (gere com `openssl rand -base64 32`) |

### Desenvolvimento
```bash
cp .env.example .env
npm install
npm run dev
```
Acesse http://localhost:3000.

### Scripts
- `npm run dev`: servidor de desenvolvimento
- `npm run build`: build de produção
- `npm run start`: executa o build de produção
- `npm run lint`: análise estática com ESLint
- `npm run typecheck`: checagem de tipos do TypeScript

### Docker Compose
O `docker-compose.yaml` fica na raiz do projeto (pasta que contém `backend/` e `frontend/`) e sobe o banco Postgres, a API e o front-end. Na raiz, execute:

```bash
docker compose --env-file backend/.env --env-file frontend/.env up -d --build
```

| Serviço | Endereço |
|---|---|
| Front-end (`next-app`) | http://localhost:3000 |
| API (`spring-app`) | http://localhost:8080 |
| Swagger | http://localhost:8080/swagger-ui/index.html |
| Postgres (`postgres-db`) | localhost:5433 |

No Compose, o front-end acessa a API pela rede interna (`http://spring-app:8080`), então o `API_URL` do `.env` é ignorado.

## Arquitetura
- As requisições do navegador passam pela rota `/api/backend/*`, que encaminha para a API Spring anexando o token JWT da sessão. Assim o token não fica exposto no cliente e a API não precisa de CORS.
- A proteção de rotas é feita em `src/proxy.ts`, que redireciona para `/login` quando não há sessão válida.
- Respostas 401 da API encerram a sessão e levam o usuário ao login.

### Estrutura de pastas
```
src/
├── app/                  # rotas (App Router)
│   ├── (dashboard)/      # páginas autenticadas com sidebar: tickets, equipments, technicians
│   ├── api/              # NextAuth e proxy para a API
│   └── login/
├── components/
│   ├── layout/           # sidebar, cabeçalho de página e logo
│   ├── shared/           # busca, estados de tabela, diálogos reutilizáveis
│   └── ui/               # componentes do shadcn/ui
├── config/               # rotas da aplicação
├── features/             # módulos: auth, tickets, equipments, technicians
│   └── <módulo>/         # api.ts, hooks.ts, schemas.ts, types.ts e components/
├── hooks/
├── lib/                  # cliente HTTP, autenticação, formatação e erros
├── providers/            # sessão, TanStack Query e notificações
└── proxy.ts              # proteção de rotas
```
