# Playwright Lab API — roteiro de estudo

Mantenha `docker compose up -d db` e `npm run api:dev` ativos antes dos testes.

## Ordem recomendada

1. Execute **Informações da API** e **Health da API**.
2. Execute **auth / Login válido**. O script salva `accessToken` e `refreshToken` automaticamente.
3. Execute **Consultar usuário autenticado** para confirmar o Bearer token.
4. Execute os fluxos numerados de `people` e `movies` em ordem. As criações salvam `personId` e `movieId`; as exclusões limpam a massa.
5. Execute os cenários negativos de payload, UUID, paginação e token.
6. Teste **Renovar token** para observar a rotação. Use **Encerrar sessão** somente ao terminar, pois ele revoga o refresh token.

Use **system / Restaurar massas de demonstração** antes de uma rodada manual completa quando quiser voltar exatamente para cinco pessoas e oito filmes. Não execute esse reset durante testes paralelos.

## O que automatizar depois com Playwright

- autenticação pela API e reaproveitamento via storage state;
- respostas 200, 201, 204, 400, 401, 403, 404 e 409;
- contratos tipados e schemas de runtime;
- criação de massa única por worker;
- armazenamento de IDs no contexto do cenário;
- limpeza em fixture ou hook, mesmo quando um teste falhar;
- renovação e expiração do token;
- bloqueio de rotas protegidas sem Bearer token;
- timeout Web de 600 segundos (10 minutos) sem interação;
- correlação de falhas usando o header `x-request-id`.
