# Revisão de prontidão para automação

Data da revisão: 10/09/2026

## Resultado executivo

O fluxo principal Web/API está funcional e preparado para receber uma primeira suíte Playwright. Build da Web, typecheck/build da API, testes unitários, login, expiração por inatividade e smoke completo da API passaram. Nenhum arquivo de automação Playwright foi criado ou alterado nesta revisão.

Ainda existem itens recomendados antes de tratar a suíte como base de regressão confiável. Os itens P0 abaixo devem ser resolvidos primeiro; P1 pode entrar junto da primeira semana de automação.

## Concluído nesta revisão

- Painel esquerdo do login reduzido ao mascote: removidos logo, selo, título e descrição.
- Removida a marca `Playwright Lab` do topo do menu lateral.
- Aviso de sessão expirada movido do centro do formulário para um toast no canto inferior direito.
- Toast com título, ícone, botão de fechar, animação, `role="alert"`, seletor estável e fechamento automático em 15 segundos.
- Expiração confirmada após 600 segundos (10 minutos) reais de inatividade.
- Motivo da expiração recuperado tanto do `sessionStorage` quanto de `reason=session-expired`, evitando aviso intermitente após o redirecionamento.
- Corrigida atualização parcial de filme: omitir `favorite` não altera mais o valor existente.
- Todos os `data-testid` estáticos auditados: não existem IDs duplicados.
- Adicionados seletores nas ações que precisavam de identificação determinística: mostrar senha, lembrar sessão, fechar aviso, retry, fechar modal, editar, excluir, favoritar e atalhos do dashboard.
- Linhas e cards usam IDs dinâmicos baseados no UUID devolvido pela API; atributos de negócio (`data-person-email` e `data-movie-title`) continuam disponíveis para localizar massas criadas pelo teste.
- Busca global corrigida: agora navega com `?q=` e aplica o termo no filtro da página de destino.
- Removido o sino com contador fictício e sem comportamento.
- Ações de criar, editar e excluir são ocultadas para usuário `USER`; a API continua aplicando 403.
- Modais fecham com `Escape`, recebem foco inicial e devolvem o foco ao botão que os abriu.
- E-mails são persistidos em lowercase e comparados sem diferença entre maiúsculas/minúsculas; títulos de filme também bloqueiam duplicidade por caixa.
- Rotação de refresh token tornou-se atômica contra duas renovações concorrentes.
- Upload inválido agora retorna 415; imagem acima de 1,5 MB retorna 413; conflitos Prisma retornam 409 e registro ausente retorna 404.
- Criado `npm run api:smoke`, incluindo CRUD, filtros, paginação inválida, duplicidade por caixa, upload inválido, rotação, logout e restauração das massas.
- Criado `npm run verify` para typecheck/build da API, build da Web e smoke da API.
- Auditoria npm de dependências de produção: zero vulnerabilidades na Web e na API.

## Prioridade P0 — decisões de Web e API

1. **Segurança da sessão.** Decidir se o laboratório continuará usando Web Storage ou se passará a usar refresh token em cookie `HttpOnly`. Para um sistema exposto, o cookie é a opção recomendada.
2. **Volume de dados.** Decidir se a Web permanecerá limitada aos primeiros 100 registros ou se terá paginação real. A API já fornece metadados de paginação.
3. **Armazenamento de imagens.** Base64 no PostgreSQL é aceitável para o laboratório pequeno. Para crescimento real, mover as imagens para storage de objetos e manter apenas a URL no banco.
4. **Confirmações.** Substituir os `confirm()` nativos de excluir/restaurar por diálogos visuais acessíveis, se a intenção for uma experiência totalmente consistente com o restante da interface.

## Prioridade P1 — qualidade funcional e segurança

- Adicionar rate limit no login e política de limpeza de refresh tokens expirados/revogados.
- Não armazenar refresh token em `localStorage` em um sistema real; preferir cookie `HttpOnly`, `Secure` e `SameSite` apropriado. Para este laboratório, documentar explicitamente o risco.
- Substituir imagens em base64 no PostgreSQL por storage de arquivos/objetos se o projeto deixar de ser apenas laboratório.
- Diferenciar no login “credenciais inválidas” de “API indisponível”, sem expor detalhes internos.
- Trocar `confirm()` por diálogos acessíveis e testáveis para exclusão e restauração de massa.

## Prioridade P2 — manutenção e experiência

- Dividir o CSS global, hoje concentrado em um único arquivo, por layout/feature.
- Adicionar estados de sucesso para criar, editar, excluir e favoritar; hoje vários fluxos só atualizam a tela sem confirmação explícita.
- Prender o foco dentro dos diálogos enquanto estiverem abertos; Escape e restauração de foco já foram implementados.
- Adicionar paginação real na Web ou documentar que a interface carrega no máximo 100 registros.
- Atualizar o README da Web, que ainda é o texto padrão do Angular e informa a porta 4200 em vez da porta 3100 usada pelo projeto.
- Inicializar Git na raiz do projeto para permitir revisão de diff, histórico e pipeline baseado em commit.

## Matriz funcional Web/API

| Área           | Cenários mínimos                                                                       |
| -------------- | -------------------------------------------------------------------------------------- |
| Autenticação   | login válido/inválido, rota protegida, logout, refresh, rotação, 600 s inativo         |
| Pessoas        | listar, buscar, filtrar, criar, editar parcial, duplicidade, excluir, validações       |
| Filmes         | listar, buscar, filtrar, criar, upload, editar parcial, favorito, duplicidade, excluir |
| Permissões     | ADMIN permitido; USER recebe 403 e não vê ações administrativas                        |
| Resiliência    | API offline, 401 durante chamada, erro 500, retry visível, request-id                  |
| Responsividade | desktop, tablet e mobile; toast sem cobrir campos/ações                                |
| Acessibilidade | nomes acessíveis, teclado, foco de modal, alertas e contraste                          |

## Ordem recomendada do trabalho Web/API

1. **Fechar comportamento:** decidir cookie seguro, rate limit, confirmação customizada, paginação e storage de imagens conforme o objetivo real do laboratório.
2. **Fechar experiência:** adicionar mensagens de sucesso para cadastrar, editar, excluir e favoritar; revisar responsividade e contraste nas três páginas.
3. **Fechar contratos:** manter rotas, códigos HTTP, payloads e códigos de erro consistentes e documentados.
4. **Fechar manutenção:** separar o CSS global por feature e substituir o README padrão da Web por instruções reais do projeto.

## Comandos de aceite

```powershell
docker compose up -d db
npm run api:dev
npm run verify
npm run web:test -- --progress=false
```

`npm run verify` pressupõe a API em `http://localhost:3030` e restaura as massas de demonstração ao terminar o smoke.
