# Playwright SDET Lab

Laboratório de Engenharia de Qualidade com uma aplicação Web, uma API REST e uma arquitetura de automação baseada em Playwright e TypeScript.

O projeto simula um ambiente próximo ao encontrado em times reais: autenticação, sessão, perfis de acesso, CRUD de pessoas e filmes, filtros, paginação, upload, persistência em banco de dados e endpoints próprios para preparação de testes.

## Objetivo

Construir uma suíte profissional de testes Web e API, aplicando práticas de Quality Engineering e SDET:

- especificações executáveis em BDD/Gherkin;
- automação Web com Playwright;
- automação de API com `APIRequestContext`;
- Page Object Model e Component Objects;
- fixtures isoladas e reutilizáveis;
- dados de teste determinísticos;
- validação de contratos em runtime;
- seletores resilientes e acessíveis;
- evidências úteis para diagnóstico;
- execução independente e preparada para paralelismo.

## Estado atual

| Componente | Estado |
| --- | --- |
| Aplicação Angular | Concluída |
| API Express + TypeScript | Concluída |
| PostgreSQL + Prisma | Concluído |
| Coleção Bruno | Concluída |
| Instalação e configuração do Playwright | Concluída |
| Smoke de autenticação | Concluído |
| Estrutura de pastas da automação | Concluída |
| Integração Playwright BDD | Concluída |
| Autenticação Web em BDD | Em desenvolvimento |
| Page Objects, fixtures e API Clients | Em desenvolvimento progressivo |

Atualmente existe um smoke técnico e a primeira feature BDD de autenticação Web. Os demais arquivos apresentados na arquitetura abaixo representam a estrutura-alvo e serão implementados progressivamente.

## Stack

### Sistema testado

- Angular;
- Node.js;
- Express;
- TypeScript;
- Prisma;
- PostgreSQL;
- Zod;
- Docker e pgAdmin.

### Engenharia de testes

- Playwright Test;
- TypeScript;
- BDD/Gherkin com Playwright BDD;
- Bruno para exploração e validação manual da API;
- relatórios HTML, screenshots, vídeos e traces do Playwright.

## Arquitetura

```text
playwright-sdet-lab/
|
|-- apps/                                  # Sistema testado
|   |-- api/                               # API Express + TypeScript
|   `-- web/                               # Aplicação Angular
|
|-- tests/                                 # Projeto de automação
|   |
|   |-- web/                               # Automação da aplicação Web
|   |   |-- features/                      # Cenários BDD Web
|   |   |   |-- authentication.feature
|   |   |   |-- people.feature
|   |   |   `-- movies.feature
|   |   |-- steps/                         # Given, When e Then Web
|   |   |   |-- authentication.steps.ts
|   |   |   |-- people.steps.ts
|   |   |   `-- movies.steps.ts
|   |   |-- pages/                         # Page Objects
|   |   |   |-- login.page.ts
|   |   |   |-- dashboard.page.ts
|   |   |   |-- people.page.ts
|   |   |   `-- movies.page.ts
|   |   |-- components/                    # Component Objects
|   |   |   |-- sidebar.component.ts
|   |   |   |-- dialog.component.ts
|   |   |   `-- notification.component.ts
|   |   |-- fixtures/                      # Fixtures exclusivas da Web
|   |   |   `-- web.fixture.ts
|   |   `-- data/                          # Massas da Web
|   |       `-- authentication.data.ts
|   |
|   |-- api/                               # Automação da API
|   |   |-- features/                      # Cenários BDD da API
|   |   |   |-- authentication.feature
|   |   |   |-- people.feature
|   |   |   `-- movies.feature
|   |   |-- steps/                         # Given, When e Then da API
|   |   |   |-- authentication.steps.ts
|   |   |   |-- people.steps.ts
|   |   |   `-- movies.steps.ts
|   |   |-- clients/                       # Requisições HTTP
|   |   |   |-- auth.client.ts
|   |   |   |-- people.client.ts
|   |   |   |-- movies.client.ts
|   |   |   `-- test-support.client.ts
|   |   |-- contracts/                     # Validação runtime
|   |   |   |-- auth.contract.ts
|   |   |   |-- people.contract.ts
|   |   |   `-- movies.contract.ts
|   |   |-- fixtures/                      # Fixtures exclusivas da API
|   |   |   `-- api.fixture.ts
|   |   `-- data/                          # Massas e payloads da API
|   |       |-- factories/
|   |       |   |-- user.factory.ts
|   |       |   |-- person.factory.ts
|   |       |   `-- movie.factory.ts
|   |       `-- payloads/
|   |
|   |-- shared/                            # Recursos compartilhados
|   |   |-- fixtures/
|   |   |   `-- test.fixture.ts
|   |   |-- domain/                        # Interfaces e tipos
|   |   |   |-- auth.types.ts
|   |   |   |-- person.types.ts
|   |   |   `-- movie.types.ts
|   |   `-- support/                       # Ambiente e constantes
|   |       |-- env.ts
|   |       |-- tags.ts
|   |       `-- constants.ts
|   |
|   `-- smoke/
|       `-- login.spec.ts                  # Smoke técnico existente
|
|-- bruno/                                 # Coleção manual da API
|-- docs/                                  # Análises e estratégia
|-- infra/                                 # Configuração do pgAdmin
|-- scripts/                               # Utilitários do projeto
|-- playwright.config.ts                   # Configuração do Playwright
|-- tsconfig.tests.json                    # Planejado para a automação
|-- package.json
|-- package-lock.json
|-- .env.example                           # Planejado para a automação
|-- .gitignore
`-- README.md
```

As pastas ainda vazias utilizam `.gitkeep` apenas para serem versionadas. Esses marcadores serão removidos quando os arquivos reais forem implementados.

## Responsabilidade das camadas

| Camada | Responsabilidade |
| --- | --- |
| `web/features` | Descrever regras e comportamentos da interface em Gherkin |
| `web/steps` | Traduzir Given, When e Then Web para chamadas pequenas |
| `web/pages` | Encapsular locators e ações específicas de uma página |
| `web/components` | Encapsular elementos compartilhados como dialogs e notificações |
| `web/fixtures` | Compor páginas e dependências exclusivas da Web |
| `web/data` | Manter massas utilizadas somente nos cenários Web |
| `api/features` | Descrever regras e comportamentos da API em Gherkin |
| `api/steps` | Traduzir Given, When e Then da API para chamadas pequenas |
| `api/clients` | Encapsular endpoints, verbos, headers e payloads HTTP |
| `api/contracts` | Validar em runtime o formato das respostas da API |
| `api/fixtures` | Compor clientes e contextos exclusivos da API |
| `api/data` | Produzir payloads e massas únicas para a API |
| `shared` | Centralizar somente fixtures, tipos e configurações realmente comuns |
| `smoke` | Confirmar rapidamente que os fluxos essenciais estão disponíveis |

## Fluxo da automação

```text
Feature
   -> Step Definition
      -> Fixture
         -> Page Object / Component Object / API Client
            -> Playwright
               -> Angular / API Express
```

Os steps representam intenção de negócio. Seletores ficam nos Page Objects, detalhes HTTP nos API Clients, contratos nas validações de runtime e massas permanecem próximas ao tipo de teste que as utiliza. A pasta `shared` evita duplicação apenas quando um recurso é realmente comum à Web e à API.

## Princípios de Engenharia de Qualidade

### Testable by Design

A aplicação foi preparada com nomes acessíveis, atributos `data-testid`, respostas HTTP consistentes, identificadores estáveis e endpoint controlado para restauração de massas.

### Isolamento

Cada cenário deverá receber página, contexto, clientes e estado próprios. Dados mutáveis não serão compartilhados globalmente entre testes.

### Dados determinísticos

Factories criarão massas únicas para permitir repetição e paralelismo. O endpoint de suporte restaurará somente o ambiente local de testes.

### Sincronização confiável

Os testes utilizarão auto-waiting e assertions web-first do Playwright. Esperas fixas não farão parte da automação funcional.

### Diagnóstico

Falhas poderão produzir screenshot, vídeo, relatório HTML e trace. Esses artefatos são gerados localmente e permanecem fora do Git.

### Separação Web e API

Os cenários Web validarão a experiência do usuário. Os cenários de API validarão status HTTP, headers, payloads, contratos, regras de negócio e persistência sem depender da interface.

## Pré-requisitos

- Node.js e npm;
- Docker Desktop;
- Git.

## Instalação

Na raiz do repositório:

```powershell
npm ci
npm --prefix apps/api ci
npm --prefix apps/web ci
npx playwright install chromium
Copy-Item apps/api/.env.example apps/api/.env
```

## Preparação do banco

```powershell
npm run stack:up
npm run api:generate
npm run api:migrate
npm run api:seed
```

## Execução da aplicação

Terminal da API:

```powershell
npm run api:dev
```

Terminal da aplicação Web:

```powershell
npm run web:dev
```

Serviços locais:

| Serviço | Endereço |
| --- | --- |
| Web | `http://localhost:3100` |
| API | `http://localhost:3030/api` |
| Health | `http://localhost:3030/api/health` |
| pgAdmin | `http://localhost:15435` |
| PostgreSQL | `localhost:5435` |

Credenciais exclusivas do ambiente local:

```text
E-mail: qa@adminlab.com
Senha:  pwd123
```

## Execução dos testes

O smoke de autenticação exige PostgreSQL e API ativos.

```powershell
npm run test:smoke
```

Execução com navegador visível:

```powershell
npm run test:smoke:headed
```

Execução desacelerada para demonstração:

```powershell
$env:PW_SLOW_MO='700'
npm run test:smoke:headed
Remove-Item Env:PW_SLOW_MO
```

Geração dos testes a partir das features BDD:

```powershell
npm run bdd:generate
```

Execução da suíte BDD:

```powershell
npm run test:bdd
```

Execução BDD com navegador visível:

```powershell
npm run test:bdd:headed
```

Outros comandos:

| Comando | Finalidade |
| --- | --- |
| `npm run test:e2e` | Executar a suíte Playwright |
| `npm run test:e2e:ui` | Abrir o modo interativo |
| `npm run test:e2e:report` | Abrir o último relatório HTML |
| `npm run bdd:generate` | Gerar os testes Playwright a partir das features |
| `npm run test:bdd` | Gerar e executar a suíte BDD |
| `npm run test:bdd:headed` | Gerar e executar a suíte BDD com navegador visível |
| `npm run web:test` | Executar testes unitários Angular |
| `npm run api:typecheck` | Validar os tipos da API |
| `npm run api:build` | Compilar a API |
| `npm run web:build` | Compilar a aplicação Web |
| `npm run api:smoke` | Verificar os fluxos principais da API |

## Documentação complementar

- [Arquitetura Playwright + BDD](docs/PLAYWRIGHT-BDD-ARCHITECTURE.md)
- [Análise de prontidão do projeto](docs/PROJECT-READINESS-REVIEW.md)
- [Estratégia de dados de teste](docs/TEST-DATA.md)

## Próximas etapas

1. Implementar os Page Objects e steps da autenticação Web.
2. Implementar os cenários de autenticação da API.
3. Implementar os fluxos Web e API de Pessoas.
4. Implementar os fluxos Web e API de Filmes.
5. Habilitar execução paralela após validar isolamento das massas.
