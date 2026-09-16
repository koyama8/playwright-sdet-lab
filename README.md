# Playwright SDET Lab

[![Quality Gate](https://img.shields.io/github/actions/workflow/status/koyama8/playwright-sdet-lab/quality.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=QUALITY%20GATE)](https://github.com/koyama8/playwright-sdet-lab/actions/workflows/quality.yml)
[![Relatório](https://img.shields.io/badge/RELAT%C3%93RIO-PLAYWRIGHT-45BA4B?style=for-the-badge&logo=playwright&logoColor=white)](https://koyama8.github.io/playwright-sdet-lab/?tab=report)
[![Vídeos da Automação](https://img.shields.io/badge/V%C3%8DDEOS-DA%20AUTOMA%C3%87%C3%83O-8B5CF6?style=for-the-badge&logo=youtube&logoColor=white)](https://koyama8.github.io/playwright-sdet-lab/?tab=videos-web)

[![Playwright](https://img.shields.io/badge/PLAYWRIGHT-1.63-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TYPESCRIPT-TIPADO-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![BDD](https://img.shields.io/badge/BDD-PLAYWRIGHT--BDD-23D96C?style=for-the-badge)](https://vitalets.github.io/playwright-bdd/)

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

| Componente                                        | Estado                                 |
| ------------------------------------------------- | -------------------------------------- |
| Aplicação Angular                                 | Concluída                              |
| API Express + TypeScript                          | Concluída                              |
| PostgreSQL + Prisma                               | Concluído                              |
| Coleção Bruno                                     | Concluída                              |
| Instalação e configuração do Playwright           | Concluída                              |
| Smoke de autenticação                             | Concluído                              |
| Estrutura de pastas da automação                  | Concluída                              |
| Integração Playwright BDD                         | Concluída                              |
| Autenticação Web em BDD                           | Concluída: 3 cenários                  |
| Page Object, fixture e massas da autenticação Web | Concluídos                             |
| Automação da autenticação da API                  | Em andamento: 2 cenários concluídos    |
| GitHub Actions                                    | Pipeline de build e testes configurada |
| Pessoas e Filmes Web/API                          | Planejados                             |

Atualmente existem um smoke técnico, três cenários BDD de autenticação Web e dois cenários BDD de autenticação da API concluídos. As duas suítes integram Feature, Steps, Fixtures, massas tipadas e suas respectivas camadas Web e API.

## Integração contínua

A workflow `Quality Pipeline` valida cada `push` e `pull request` direcionado à branch `main`. Também é possível iniciá-la manualmente pela aba **Actions** do GitHub.

A esteira possui dois quality gates:

| Job              | Responsabilidade                                                           |
| ---------------- | -------------------------------------------------------------------------- |
| `Build`          | Instalar dependências, validar TypeScript e compilar API e Web             |
| `Playwright BDD` | Preparar PostgreSQL e Prisma, subir a API e executar os cenários Web e API |

O job de testes somente começa depois que o build é aprovado. Em cada execução, o GitHub Actions disponibiliza um artifact chamado `playwright-evidences-<número>` contendo:

- relatório HTML do Playwright;
- screenshots, vídeos de todos os cenários executados na CI e traces produzidos conforme a configuração;
- log da API usada durante os testes.

Para consultar as evidências, clique no badge **Relatórios e evidências**, escolha a execução desejada e baixe o artifact exibido no final da página. Os artifacts são mantidos por 30 dias.

Os badges **Relatório Playwright** e **Vídeos Evidências** abrem uma interface publicada no GitHub Pages. A primeira aba incorpora o relatório HTML completo; a segunda reúne automaticamente os vídeos de todos os cenários executados pela última pipeline aprovada na branch `main`.

## Cobertura de autenticação Web

| ID                | Cenário                                  | Tags principais        | Estado    |
| ----------------- | ---------------------------------------- | ---------------------- | --------- |
| `CT-WEB-AUTH-001` | Login com credenciais válidas            | `@smoke` `@positive`   | Concluído |
| `CT-WEB-AUTH-002` | Login com credenciais inválidas          | `@negative`            | Concluído |
| `CT-WEB-AUTH-003` | Expiração após 10 minutos de inatividade | `@session` `@negative` | Concluído |

O cenário de expiração utiliza o relógio virtual do Playwright para avançar os 10 minutos de forma determinística, sem adicionar espera fixa à execução.

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

A árvore apresenta os arquivos implementados na autenticação Web e a estrutura-alvo reservada para os próximos domínios.

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
|   |   |   |-- authentication.page.ts
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
|-- .github/
|   `-- workflows/
|       `-- quality.yml                    # Build e testes no GitHub Actions
|-- playwright.config.ts                   # Configuração do Playwright
|-- tsconfig.json                          # TypeScript da automação
|-- package.json
|-- package-lock.json
|-- .gitignore
`-- README.md
```

As pastas ainda vazias utilizam `.gitkeep` apenas para serem versionadas. Esses marcadores serão removidos quando os arquivos reais forem implementados.

## Responsabilidade das camadas

| Camada           | Responsabilidade                                                     |
| ---------------- | -------------------------------------------------------------------- |
| `web/features`   | Descrever regras e comportamentos da interface em Gherkin            |
| `web/steps`      | Traduzir Given, When e Then Web para chamadas pequenas               |
| `web/pages`      | Encapsular locators e ações específicas de uma página                |
| `web/components` | Encapsular elementos compartilhados como dialogs e notificações      |
| `web/fixtures`   | Compor páginas e dependências exclusivas da Web                      |
| `web/data`       | Manter massas utilizadas somente nos cenários Web                    |
| `api/features`   | Descrever regras e comportamentos da API em Gherkin                  |
| `api/steps`      | Traduzir Given, When e Then da API para chamadas pequenas            |
| `api/clients`    | Encapsular endpoints, verbos, headers e payloads HTTP                |
| `api/contracts`  | Validar em runtime o formato das respostas da API                    |
| `api/fixtures`   | Compor clientes e contextos exclusivos da API                        |
| `api/data`       | Produzir payloads e massas únicas para a API                         |
| `shared`         | Centralizar somente fixtures, tipos e configurações realmente comuns |
| `smoke`          | Confirmar rapidamente que os fluxos essenciais estão disponíveis     |

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

As credenciais de demonstração ficam em uma massa Web tipada e reutilizável. Nos cenários de Pessoas e Filmes, factories criarão massas únicas para permitir repetição e paralelismo. O endpoint de suporte restaura somente o ambiente local de testes.

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

| Serviço    | Endereço                           |
| ---------- | ---------------------------------- |
| Web        | `http://localhost:3100`            |
| API        | `http://localhost:3030/api`        |
| Health     | `http://localhost:3030/api/health` |
| pgAdmin    | `http://localhost:15435`           |
| PostgreSQL | `localhost:5435`                   |

Credenciais exclusivas do ambiente local:

```text
E-mail: qa@adminlab.com
Senha:  pwd123
```

## Execução dos testes

O smoke e os cenários BDD Web exigem PostgreSQL, API e aplicação Web ativos.

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

Execução somente da autenticação Web:

```powershell
npm run bdd:generate
npx playwright test --project=bdd-chromium --grep "@authentication"
```

Execução de um caso de teste específico:

```powershell
npm run bdd:generate
npx playwright test --project=bdd-chromium --grep "@CT_WEB_AUTH_001"
```

Interface interativa somente com os cenários Web:

```powershell
npm run test:web:ui
```

Interface interativa somente com os cenários de API:

```powershell
npm run test:api:ui
```

Os comandos de UI geram novamente os testes BDD antes de abrir o Playwright. O filtro `@web` mantém apenas as features Web e o filtro `@api` mantém apenas as features da API.

Outros comandos:

| Comando                   | Finalidade                                            |
| ------------------------- | ----------------------------------------------------- |
| `npm run test:e2e`        | Executar a suíte Playwright                           |
| `npm run test:e2e:ui`     | Abrir o modo interativo                               |
| `npm run test:e2e:report` | Abrir o último relatório HTML                         |
| `npm run bdd:generate`    | Gerar os testes Playwright a partir das features      |
| `npm run test:bdd`        | Gerar e executar a suíte BDD                          |
| `npm run test:bdd:headed` | Gerar e executar a suíte BDD com navegador visível    |
| `npm run test:web:ui`     | Abrir no Playwright UI somente os cenários com `@web` |
| `npm run test:api:ui`     | Abrir no Playwright UI somente os cenários com `@api` |
| `npm run web:test`        | Executar testes unitários Angular                     |
| `npm run api:typecheck`   | Validar os tipos da API                               |
| `npm run api:build`       | Compilar a API                                        |
| `npm run web:build`       | Compilar a aplicação Web                              |
| `npm run api:smoke`       | Verificar os fluxos principais da API                 |

## Próximas etapas

1. Implementar os cenários de autenticação da API.
2. Implementar os fluxos Web e API de Pessoas.
3. Implementar os fluxos Web e API de Filmes.
4. Habilitar execução paralela após validar o isolamento das massas.
5. Publicar o relatório HTML no GitHub Pages após consolidar as suítes Web e API.
