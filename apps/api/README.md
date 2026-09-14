# Playwright Lab API

API REST em Node.js, Express, TypeScript, Prisma e PostgreSQL para sustentar os cenários Web/API do laboratório.

## Executar localmente

Na raiz do repositório:

```powershell
docker compose up -d db
Copy-Item apps/api/.env.example apps/api/.env -ErrorAction SilentlyContinue
npm --prefix apps/api install
npm --prefix apps/api run prisma:generate
npm --prefix apps/api run prisma:migrate
npm --prefix apps/api run prisma:seed
npm run api:dev
```

O PostgreSQL deste projeto usa a porta local `5435` para não conflitar com o ambiente Cypress que já ocupa a `5434`.

Health: `GET http://localhost:3030/api/health`.

O health também consulta o PostgreSQL. Quando o banco não responde, a API retorna `503` com `database: unavailable`.

O seed cria o administrador local `qa@adminlab.com` com senha `pwd123`. Essas credenciais são exclusivas do ambiente local e não devem ser usadas em produção.

## Autenticação

`POST /api/auth/login` retorna um access token JWT curto e um refresh token opaco. Use o access token como `Authorization: Bearer <token>`.

A resposta também informa a política usada pelo Web: access token de 900 segundos, refresh token de 7 dias e encerramento da sessão após 600 segundos (10 minutos) sem interação. O Web renova o access token quando necessário, mas não renova uma sessão inativa.

- `POST /api/auth/refresh` faz rotação do refresh token;
- `POST /api/auth/logout` revoga o refresh token;
- `GET /api/auth/me` retorna o usuário autenticado.

Os refresh tokens são armazenados somente como hash no banco. Segredos JWT ficam no `.env`, que é ignorado pelo Git.

Todas as respostas incluem `x-request-id`; os erros também devolvem esse valor em `error.requestId`, permitindo correlacionar falhas em testes, traces e logs.

## Recursos

### Pessoas

- `GET /api/people`
- `GET /api/people/:id`
- `POST /api/people` (ADMIN)
- `PATCH /api/people/:id` (ADMIN)
- `DELETE /api/people/:id` (ADMIN)

### Filmes

- `GET /api/movies`
- `GET /api/movies/:id`
- `POST /api/movies` (ADMIN; JSON ou multipart com campo `image`)
- `PATCH /api/movies/:id` (ADMIN; JSON ou multipart)
- `POST /api/movies/:id/favorite`
- `DELETE /api/movies/:id` (ADMIN)

### Suporte a testes

- `POST /api/test-support/reset` (ADMIN; somente fora de produção)

Esse endpoint e o comando `npm run api:reset` removem dados adicionais e restauram as cinco pessoas e os oito filmes de demonstração. A estratégia completa está em `docs/TEST-DATA.md`.

Todos os payloads são validados com Zod. Listagens possuem busca, filtros e paginação. Erros têm formato consistente `{ error, details? }`.

## Verificações

```powershell
npm run api:typecheck
npm run api:build
```

A coleção Bruno em `bruno/` contém health, login, usuário atual e exemplos de pessoas e filmes.

## Stack completa com Docker

Na raiz, execute `npm run stack:up`. O Compose sobe somente PostgreSQL e pgAdmin. A API e a Web são executadas localmente pelos scripts `npm run api:dev` e `npm run web:dev`, enquanto o Bruno chama a API em `localhost:3030`. Use `npm run stack:status` para conferir e `npm run stack:down` para encerrar.

O pgAdmin fica em `http://localhost:15435`:

- Login: `admin@example.com`
- Senha: `admin123`
- Banco: `playwright_lab`
- Usuário do banco: `qa_user`
- Senha do banco: `qa_password`
- Host dentro do pgAdmin: `db`
- Porta dentro do pgAdmin: `5432`
