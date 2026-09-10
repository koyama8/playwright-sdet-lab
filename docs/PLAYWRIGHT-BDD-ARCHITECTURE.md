# Arquitetura proposta — Playwright + TypeScript + BDD

## 1. Decisão executiva

Para este laboratório, a opção recomendada é:

- **Playwright Test** como executor;
- **TypeScript** em modo estrito;
- **playwright-bdd** como adaptador entre Gherkin e o Playwright Test;
- arquivos `.feature` como especificação executável;
- steps pequenos, responsáveis somente por traduzir a linguagem de negócio;
- Page Objects e Component Objects para a interface;
- API Clients para transporte HTTP;
- factories para massas dinâmicas;
- fixtures do Playwright para composição, isolamento e ciclo de vida.

O desenho conceitual usado no projeto Cypress continua válido — `feature -> step -> método -> aplicação` —, mas a infraestrutura não deve ser copiada literalmente. No Playwright, fixtures, `BrowserContext`, `APIRequestContext`, projects, traces e o runner nativo substituem grande parte do que no Cypress ficava em `support`, custom commands e plugins.

## 2. O que o desafio em PDF realmente exige

O documento da HCXpert é um desafio **específico de Cypress**, com uma árvore rígida para permitir avaliação automatizada. Ele exige BDD/Cucumber, JavaScript ou TypeScript, POM/App Actions, separação entre elementos, ações e cenários, massas, evidências, API, segurança, performance e CI/CD.

Portanto:

- a separação de responsabilidades do PDF é uma boa referência;
- os nomes `cypress/e2e`, `commands.js`, `e2e.js` e `cypress.config.js` não pertencem ao novo laboratório;
- copiar aquela árvore exatamente para Playwright produziria uma migração visual, não uma arquitetura nativa;
- performance, segurança e CI/CD podem ser adicionados depois; a primeira fundação deve ser Web + API estáveis.

## 3. Alternativas avaliadas

### Opção A — Playwright Test + playwright-bdd — recomendada

O adaptador gera testes nativos a partir dos `.feature`. Assim, o projeto mantém Given/When/Then e usa fixtures, projetos, paralelismo, retries, relatório HTML e traces do Playwright.

**Vantagens**

- experiência mais próxima do Playwright profissional;
- isolamento automático por teste;
- Page, BrowserContext e APIRequestContext via fixtures;
- execução multi-browser e perfis por project;
- diagnóstico nativo com trace e relatório HTML;
- uma única configuração principal em `playwright.config.ts`.

**Custo consciente**

- `playwright-bdd` é uma dependência comunitária;
- há uma etapa de geração dos testes BDD;
- upgrades precisam validar compatibilidade entre Playwright e o adaptador.

### Opção B — Cucumber-JS como runner + Playwright como biblioteca

O Cucumber controla a execução. Um `World` cria e armazena browser, contexto, página e clientes de API, enquanto hooks fazem setup e teardown.

**Quando escolher**

- quando a empresa exige especificamente o runner oficial do Cucumber;
- quando os relatórios, plugins e integrações da organização dependem dele;
- quando a portabilidade do BDD entre drivers é mais importante que os recursos do Playwright Test.

**Custo**

- o time precisa administrar manualmente browser/context/page, traces, screenshots e parte dos relatórios;
- não se recebem automaticamente todas as fixtures e projects do Playwright Test;
- há mais infraestrutura própria para manter.

### Opção C — Playwright Test sem Cucumber

É a opção mais simples e mais nativa, mas não atende ao objetivo deste laboratório, que é demonstrar BDD executável e aproveitar sua experiência anterior com Cucumber.

## 4. Árvore proposta

```text
playwright-sdet-lab/
├── apps/                              # sistema sob teste (já existente)
│   ├── web/
│   └── api/
├── tests/
│   ├── features/                      # comportamento, sem código técnico
│   │   ├── web/
│   │   │   ├── authentication.feature
│   │   │   ├── people.feature
│   │   │   └── movies.feature
│   │   └── api/
│   │       ├── authentication.feature
│   │       ├── people.feature
│   │       └── movies.feature
│   ├── steps/                         # cola fina entre Gherkin e domínio técnico
│   │   ├── web/
│   │   │   ├── authentication.steps.ts
│   │   │   ├── people.steps.ts
│   │   │   └── movies.steps.ts
│   │   └── api/
│   │       ├── authentication.steps.ts
│   │       ├── people.steps.ts
│   │       └── movies.steps.ts
│   ├── fixtures/
│   │   ├── test.fixture.ts            # composição das fixtures exportadas
│   │   ├── pages.fixture.ts
│   │   ├── api.fixture.ts
│   │   └── scenario.fixture.ts        # estado mutável isolado do cenário
│   ├── web/
│   │   ├── pages/
│   │   │   ├── login.page.ts
│   │   │   ├── people.page.ts
│   │   │   └── movies.page.ts
│   │   └── components/
│   │       ├── sidebar.component.ts
│   │       ├── dialog.component.ts
│   │       └── notification.component.ts
│   ├── api/
│   │   ├── clients/
│   │   │   ├── auth.client.ts
│   │   │   ├── people.client.ts
│   │   │   ├── movies.client.ts
│   │   │   └── test-support.client.ts
│   │   └── contracts/
│   │       ├── auth.contract.ts
│   │       ├── people.contract.ts
│   │       └── movies.contract.ts
│   ├── data/
│   │   └── factories/
│   │       ├── user.factory.ts
│   │       ├── person.factory.ts
│   │       └── movie.factory.ts
│   ├── domain/
│   │   ├── auth.types.ts
│   │   ├── person.types.ts
│   │   └── movie.types.ts
│   └── support/
│       ├── env.ts
│       └── tags.ts
├── playwright.config.ts
├── tsconfig.tests.json
├── .env.example
├── package.json
└── README.md
```

O diretório gerado pelo adaptador BDD deve ser tratado como build output e ignorado no Git. Ele não é código-fonte para edição manual.

## 5. Responsabilidade de cada camada

| Camada | Deve conter | Não deve conter |
|---|---|---|
| Feature | regra, intenção e resultado observável | seletor, URL técnica, JSON detalhado, espera |
| Step | tradução do passo e orquestração curta | locator espalhado, regra duplicada, fluxo inteiro |
| Page Object | locators e ações de uma página | massa global, HTTP, cenário BDD |
| Component Object | comportamento de elementos compartilhados | conhecimento de uma jornada completa |
| API Client | endpoint, verbo, headers e serialização | cenário, dado hardcoded, assertion de UI |
| Contract | validação runtime do payload | criação de massa ou chamadas HTTP |
| Factory | dados válidos e variações controladas | chamadas à aplicação |
| Fixture | construção, injeção e descarte de dependências | regra de negócio do cenário |
| Scenario state | IDs, respostas e entidades criadas naquele teste | singleton ou estado compartilhado entre testes |

## 6. Fluxo correto de uma automação

```text
.feature
   ↓ descreve o comportamento
step definition
   ↓ coordena uma intenção pequena
Page/Component Object ou API Client
   ↓ usa Playwright
Web ou API
   ↓ devolve estado observável
Then + expect/contract
```

Exemplo conceitual:

```gherkin
Cenário: autenticar com credenciais válidas
  Dado que possuo um usuário ativo
  Quando entro com credenciais válidas
  Então devo visualizar o painel principal
```

O `Dado` obtém/cria a massa; o `Quando` chama `LoginPage.login`; o `Então` usa uma expectativa web-first sobre um elemento ou URL que represente o painel. O step não deve conhecer `#email`, tempos fixos ou detalhes do formulário.

## 7. Regras que dão aparência de projeto real

1. **Steps finos, não vazios.** Eles devem revelar a intenção e chamar uma pequena composição de métodos. Criar uma pasta com um arquivo para cada método apenas espalha complexidade.
2. **Sem `BasePage` genérica.** Métodos como `click`, `fill` e `wait` não formam linguagem de domínio. Prefira `login`, `createPerson`, `markMovieAsFavorite` e composição de componentes.
3. **Locators semânticos primeiro.** Prioridade: role/label/texto acessível quando representa o contrato do usuário; `data-testid` para elementos sem semântica estável ou contratos específicos de teste.
4. **Sem espera fixa.** Ações e assertions do Playwright têm auto-wait; sincronizações excepcionais devem esperar por um evento real, resposta ou estado.
5. **Um contexto isolado por cenário.** Nunca compartilhar `page`, token mutável, resposta ou ID criado por meio de variável global.
6. **Preparação pela API quando o objetivo é Web.** O Given pode criar pré-condições rapidamente pela API; o When/Then preserva a ação e a validação relevantes na interface.
7. **Teste de API independente da interface.** Features de API chamam clients diretamente e validam status, corpo, headers, contrato e efeitos persistidos.
8. **Tipos não substituem contratos.** TypeScript protege o código em compilação; Zod ou JSON Schema verifica o payload recebido em runtime.
9. **Dados únicos por cenário.** Factories geram e-mail/nome identificável por execução; cleanup remove apenas o que o próprio cenário criou.
10. **Retries não escondem defeitos.** Retry serve principalmente para produzir diagnóstico adicional; um teste que passa somente na repetição deve permanecer visível como flaky.

## 8. Estratégia para Web e API do laboratório

### Web

- `LoginPage`: abrir, preencher credenciais, enviar e expor sinais de sucesso/erro;
- `PeoplePage`: filtros e operações específicas de pessoas;
- `MoviesPage`: filtros, CRUD e favorito;
- `SidebarComponent`, `DialogComponent` e `NotificationComponent`: elementos reutilizados em várias páginas;
- assertions ficam nos `Then`, usando locators semânticos expostos pelos objetos quando necessário.

### API

- um client por recurso de negócio, não um único client gigante;
- fixture `api` fornece `APIRequestContext` e clients já configurados;
- login/refresh e perfis de autorização ficam no `AuthClient`;
- `TestSupportClient` é usado para preparação/reset controlado, sem entrar nos cenários de negócio como atalho indevido;
- cada operação retorna resposta suficiente para o step validar status, contrato e regra;
- contratos refletem sucesso e erros esperados, não apenas o caminho feliz.

### Autenticação

- o cenário de login sempre passa pela tela;
- cenários cujo objetivo não é login podem receber estado autenticado por fixture/API;
- qualquer arquivo de `storageState` deve ficar fora do versionamento, pois pode conter cookies e headers sensíveis;
- perfis de usuário diferentes devem ser fixtures ou projects explícitos, não condicionais escondidos nos steps.

## 9. Tags e suítes

Começar com poucas tags, cada uma com finalidade operacional:

- `@web` e `@api`: superfície testada;
- `@smoke` e `@regression`: profundidade da suíte;
- `@negative`: regra de exceção;
- `@auth`, `@people`, `@movies`: domínio;
- `@slow`: somente para casos legitimamente demorados, como expiração após dois minutos.

Evitar tags como `@dev`, `@qa` ou `@prod` dentro das features. Ambiente é configuração, não comportamento.

## 10. Ordem de implementação

### Fase 1 — fundação mínima

- dependências e configuração;
- TypeScript estrito;
- fixtures base;
- geração BDD;
- projects `web-chromium` e `api`;
- relatório HTML e trace em falha/retry.

### Fase 2 — primeira fatia vertical

- `authentication.feature` Web;
- `authentication.steps.ts`;
- `LoginPage`;
- `AuthClient`;
- factory de usuário/credenciais;
- cenários positivo, senha inválida e sessão expirada.

Essa fatia deve provar o fluxo inteiro da arquitetura antes de criar dezenas de arquivos.

### Fase 3 — domínios completos

- Pessoas Web + API;
- Filmes Web + API;
- contratos de sucesso e erro;
- preparação e limpeza de massas por cenário.

### Fase 4 — robustez

- execução paralela;
- Firefox e WebKit em uma suíte selecionada;
- testes de autorização por perfil;
- evidências e matriz de rastreabilidade;
- somente depois: CI/CD, k6, Lighthouse e segurança.

## 11. Critérios para considerar a arquitetura pronta

- um cenário Web e um API executam pelo mesmo comando base;
- cada teste recebe estado isolado;
- não existe variável global mutável entre cenários;
- steps não contêm seletores;
- Page Objects não chamam API;
- API Clients não fazem assertions de UI;
- massas paralelas não colidem;
- contratos validam runtime;
- falha gera relatório e trace útil;
- a suíte roda sem sleeps fixos;
- os arquivos gerados pelo BDD não são editados nem versionados.

## 12. Fontes da pesquisa

1. Playwright, **Fixtures**: https://playwright.dev/docs/test-fixtures
2. Playwright, **Best Practices**: https://playwright.dev/docs/best-practices
3. Playwright, **APIRequestContext**: https://playwright.dev/docs/api/class-apirequestcontext
4. Playwright, **Authentication**: https://playwright.dev/docs/auth
5. Playwright, **Projects**: https://playwright.dev/docs/test-projects
6. Playwright, **Trace Viewer**: https://playwright.dev/docs/trace-viewer-intro
7. Cucumber, **State / World**: https://cucumber.io/docs/cucumber/state/
8. Cucumber-JS, **Configuration**: https://github.com/cucumber/cucumber-js/blob/main/docs/configuration.md
9. Cucumber-JS, **World**: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/world.md
10. playwright-bdd, **Repository and design rationale**: https://github.com/vitalets/playwright-bdd
11. playwright-bdd, **Configuration**: https://github.com/vitalets/playwright-bdd/blob/main/docs/configuration/index.md
12. HCXpert, **Desafio Técnico – Engenharia de Qualidade 2026.2**, PDF fornecido pelo usuário.

