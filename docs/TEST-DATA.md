# Estratégia de massas de teste

O laboratório mantém cinco pessoas e oito filmes como dados-base. A Web e o Bruno usam a mesma API e o mesmo PostgreSQL.

## Preparação determinística

Antes de uma suíte completa, execute na raiz:

```powershell
npm run api:reset
```

O comando recusa execução em `production` e também recusa bancos cujo `DATABASE_URL` não contenha `playwright_lab`. Ele remove dados adicionais e restaura os registros-base sem encerrar a sessão do administrador.

Também é possível restaurar os mesmos dados pela Web ou com `POST /api/test-support/reset`. Esse endpoint exige token ADMIN e responde apenas fora de produção.

## Isolamento para automação futura

- Cada cenário deve criar sua própria pessoa ou filme pela API.
- Use valores únicos, preferencialmente com um identificador da execução no e-mail ou título.
- Guarde o `id` retornado pela criação.
- Exclua somente os IDs criados pelo cenário no teardown, mesmo quando a validação falhar.
- Não dependa da ordem dos registros nem de UUIDs fixos.
- Em execução paralela, use um sufixo diferente por worker.
- Reserve `npm run api:reset` para o início ou fim da suíte completa; não execute o reset enquanto outros workers estiverem ativos.

Exemplo de convenção de massa:

```text
email: qa+<runId>-<workerId>-<cenario>@lab.local
filme: Filme <runId>-<workerId>-<cenario>
```

Essa estratégia permite preparar dados por API, validar o resultado pela interface e limpar exatamente o que o teste criou.
