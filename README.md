# Playwright SDET Lab

[![Quality Gate](https://img.shields.io/github/actions/workflow/status/koyama8/playwright-sdet-lab/quality.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=QUALITY%20GATE)](https://github.com/koyama8/playwright-sdet-lab/actions/workflows/quality.yml)
[![Relatório](https://img.shields.io/badge/RELAT%C3%93RIO-PLAYWRIGHT-45BA4B?style=for-the-badge&logo=playwright&logoColor=white)](https://koyama8.github.io/playwright-sdet-lab/?tab=report)
[![Vídeos](https://img.shields.io/badge/V%C3%8DDEOS-AUTOMA%C3%87%C3%83O-8B5CF6?style=for-the-badge&logo=youtube&logoColor=white)](https://koyama8.github.io/playwright-sdet-lab/?tab=videos-web)

[![Playwright](https://img.shields.io/badge/PLAYWRIGHT-1.63-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TYPESCRIPT-TIPADO-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![BDD](https://img.shields.io/badge/BDD-PLAYWRIGHT--BDD-23D96C?style=for-the-badge)](https://vitalets.github.io/playwright-bdd/)

Laboratório de Engenharia de Qualidade que reúne uma aplicação Web, uma API REST e uma suíte de automação construída com Playwright, TypeScript e BDD.

O sistema disponibiliza autenticação, controle de sessão, perfis de acesso e operações sobre pessoas e filmes, com persistência em PostgreSQL.

## Objetivo

Demonstrar uma arquitetura de automação Web e API próxima à utilizada em projetos reais, priorizando:

- cenários executáveis em BDD/Gherkin;
- separação clara de responsabilidades;
- Page Objects para interações Web;
- API Clients para requisições HTTP;
- fixtures e contextos isolados por cenário;
- factories para criação de massas dinâmicas;
- contratos para validação de respostas;
- execução local e em pipeline;
- relatórios, vídeos, screenshots e traces.

## Stack

| Aplicação | Automação |
| --- | --- |
| Angular, Node.js, Express, TypeScript, Prisma, PostgreSQL, Zod e Docker | Playwright Test, Playwright BDD, TypeScript, Faker, Bruno, GitHub Actions e GitHub Pages |

## Arquitetura

```text
playwright-sdet-lab/
├── apps/
│   ├── api/                         # API Express
│   └── web/                         # Aplicação Angular
│
├── tests/
│   ├── api/
│   │   ├── clients/                 # Requisições e endpoints
│   │   ├── contracts/               # Validação das respostas
│   │   ├── data/
│   │   │   ├── factories/           # Massas dinâmicas
│   │   │   └── payloads/            # Payloads fixos
│   │   ├── features/                # Cenários BDD da API
│   │   ├── fixtures/                # Clients e contextos da API
│   │   └── steps/                   # Steps da API
│   │
│   ├── web/
│   │   ├── data/                    # Massas da automação Web
│   │   ├── features/                # Cenários BDD Web
│   │   ├── fixtures/                # Page Objects e contextos Web
│   │   ├── pages/                   # Page Objects
│   │   └── steps/                   # Steps Web
│   │
│   └── smoke/                       # Validação rápida do sistema
│
├── bruno/                            # Coleção para exploração da API
├── docs/                             # Documentação complementar
├── infra/                            # Infraestrutura local
├── report-site/                      # Interface de evidências
├── scripts/                          # Scripts de apoio e publicação
├── .github/workflows/quality.yml     # Quality Pipeline
├── playwright.config.ts
├── docker-compose.yml
├── package.json
└── README.md
```

## Organização da automação

| Camada | Responsabilidade |
| --- | --- |
| `features` | Descrever os comportamentos em Gherkin |
| `steps` | Conectar o cenário às camadas de automação |
| `pages` | Encapsular locators e ações da interface |
| `clients` | Encapsular endpoints, headers e requisições |
| `fixtures` | Criar e entregar dependências isoladas |
| `data` | Fornecer payloads e massas de teste |
| `contracts` | Validar status e dados retornados pela API |

### Fluxo Web

```text
Feature → Steps → Fixture → Page Object → Aplicação Web
```

### Fluxo API

```text
Feature → Steps → Fixture → API Client → API REST
                               ↓
                            Contract
```

## Pré-requisitos

- Node.js
- npm
- Docker Desktop
- Git

## Instalação

Na raiz do projeto:

```powershell
npm ci
npm --prefix apps/api ci
npm --prefix apps/web ci
npx playwright install chromium
Copy-Item apps/api/.env.example apps/api/.env
```

## Preparação do ambiente

Inicie a infraestrutura e prepare o banco:

```powershell
npm run stack:up
npm run api:generate
npm run api:migrate
npm run api:seed
```

Inicie a API:

```powershell
npm run api:dev
```

Em outro terminal, inicie a aplicação Web:

```powershell
npm run web:dev
```

### Serviços locais

| Serviço | Endereço |
| --- | --- |
| Aplicação Web | `http://localhost:3100` |
| API | `http://localhost:3030/api` |
| Health check | `http://localhost:3030/api/health` |
| pgAdmin | `http://localhost:15435` |
| PostgreSQL | `localhost:5435` |

Credenciais do ambiente local:

```text
E-mail: qa@adminlab.com
Senha:  pwd123
```

## Execução dos testes

Gerar e executar todos os cenários BDD:

```powershell
npm run test:bdd
```

Executar com navegador visível:

```powershell
npm run test:bdd:headed
```

Abrir somente os cenários Web no Playwright UI:

```powershell
npm run test:web:ui
```

Abrir somente os cenários de API no Playwright UI:

```powershell
npm run test:api:ui
```

Executar um CT específico:

```powershell
npm run bdd:generate
npx playwright test --project=bdd-chromium --grep "@CT_API_MOVIES_001"
```

Executar o smoke:

```powershell
npm run test:smoke
```

Abrir o último relatório local:

```powershell
npm run test:e2e:report
```

## Evidências

A execução automatizada pode produzir:

- relatório HTML do Playwright;
- vídeos dos cenários;
- screenshots de falhas;
- traces para investigação;
- logs da API.

Os badges no início deste README permitem acessar a Quality Pipeline, o relatório publicado e a galeria de vídeos da execução mais recente.
