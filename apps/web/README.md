# Playwright Lab Web

Interface Angular do laboratório, integrada à API local em `http://localhost:3030/api`.

## Executar

Na raiz do projeto, mantenha PostgreSQL e API ativos e inicie a Web:

```powershell
docker compose up -d db
npm run api:dev
npm run web:dev
```

Acesse `http://localhost:3100`. O usuário local é `qa@adminlab.com` e a senha é `pwd123`.

## Fluxos disponíveis

- autenticação, renovação, logout e expiração após 120 segundos sem atividade;
- dashboard com resumo de pessoas e filmes favoritos;
- criação, consulta, edição, filtro e exclusão de pessoas;
- criação, consulta, edição, filtro, upload de capa, favorito e exclusão de filmes;
- busca global e restauração das massas de demonstração.

## Verificação

```powershell
npm run web:build
npm run web:test -- --progress=false
```

Os elementos importantes possuem nomes acessíveis e `data-testid`. Ações associadas a um registro usam o UUID retornado pela API, por exemplo `edit-person-<id>` e `favorite-movie-<id>`.
