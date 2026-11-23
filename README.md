# Playwright SDET Lab

[![Relatório](https://img.shields.io/badge/RELAT%C3%93RIO-PLAYWRIGHT-45BA4B?style=for-the-badge&logo=playwright&logoColor=white)](https://koyama8.github.io/playwright-sdet-lab/)
[![Playwright](https://img.shields.io/badge/PLAYWRIGHT-1.63-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TYPESCRIPT-TIPADO-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![BDD](https://img.shields.io/badge/BDD-PLAYWRIGHT--BDD-23D96C?style=for-the-badge)](https://vitalets.github.io/playwright-bdd/)

Laboratório completo de Engenharia de Qualidade com aplicação Web, API REST, banco de dados e automação de testes utilizando Playwright, TypeScript e BDD.

O projeto demonstra práticas utilizadas em projetos profissionais, como Page Objects, API Clients, fixtures tipadas, massas dinâmicas, contratos de resposta e geração de evidências.

## Sobre o projeto

O Playwright SDET Lab demonstra uma arquitetura profissional de automação Web e API com Playwright, TypeScript e BDD.

A aplicação possui autenticação, controle de acesso e gerenciamento de pessoas e filmes, com persistência em PostgreSQL.

**Práticas aplicadas:** Gherkin · Page Object Model · API Clients · Fixtures tipadas · Factories · Contratos · Relatórios e evidências

## Tecnologias

| Área | Tecnologias |
| --- | --- |
| Automação | Playwright Test, playwright-bdd e TypeScript |
| Aplicação Web | Angular e TypeScript |
| API | Node.js, Express, TypeScript e Zod |
| Persistência | PostgreSQL e Prisma |
| Massa de testes | Faker |
| Exploração de API | Bruno |
| Infraestrutura | Docker e Docker Compose |

## Arquitetura da solução

```text
                     ┌─────────────────┐
                     │ Feature Gherkin │
                     └────────┬────────┘
                              │
                     ┌────────▼────────┐
                     │ Step Definition │
                     └────────┬────────┘
                              │
               ┌──────────────┴──────────────┐
               │                             │
      ┌────────▼────────┐           ┌────────▼────────┐
      │   Web Fixture   │           │   API Fixture   │
      └────────┬────────┘           └────────┬────────┘
               │                             │
      ┌────────▼────────┐           ┌────────▼────────┐
      │   Page Object   │           │   API Client    │
      └────────┬────────┘           └────────┬────────┘
               │                             │
      ┌────────▼────────┐           ┌────────▼────────┐
      │ Aplicação Web   │           │    API REST     │
      └─────────────────┘           └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │    Contract     │
                                    └─────────────────┘
```

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

## Estrutura do projeto

```text
playwright-sdet-lab/
├── apps/
│   ├── api/                          # API REST com Express e Prisma
│   └── web/                          # Aplicação Web Angular
│
├── tests/
│   ├── api/
│   │   ├── clients/                  # Endpoints e requisições HTTP
│   │   ├── contracts/                # Validações das respostas
│   │   ├── data/
│   │   │   ├── factories/            # Massas dinâmicas
│   │   │   └── payloads/             # Payloads controlados
│   │   ├── features/                 # Cenários BDD da API
│   │   ├── fixtures/                 # Clients e estados dos cenários
│   │   └── steps/                    # Steps da API
│   │
│   ├── web/
│   │   ├── data/                     # Dados da automação Web
│   │   ├── features/                 # Cenários BDD Web
│   │   ├── fixtures/                 # Page Objects dos testes
│   │   ├── pages/                    # Page Objects
│   │   └── steps/                    # Steps Web
│   │
│   └── smoke/                        # Verificação rápida do sistema
│
├── bruno/                             # Coleção de requisições da API
├── docs/                              # Documentação técnica
├── infra/                             # Configurações de infraestrutura
├── scripts/                           # Publicação do relatório Playwright
├── docker-compose.yml
├── playwright.config.ts
├── package.json
└── README.md
```

## Responsabilidade das camadas

| Camada | Responsabilidade |
| --- | --- |
| `features` | Descrever regras e comportamentos em Gherkin |
| `steps` | Traduzir os cenários e chamar a camada apropriada |
| `pages` | Encapsular locators, ações e validações Web |
| `clients` | Encapsular endpoints e requisições HTTP |
| `fixtures` | Criar e fornecer dependências isoladas |
| `data` | Disponibilizar payloads e massas de teste |
| `contracts` | Validar status, estrutura e conteúdo das respostas |

Essa separação evita seletores nos steps, chamadas HTTP nos Page Objects e compartilhamento indevido de estado entre cenários.

## Estratégia de testes

### Testes Web

Os testes Web validam as jornadas observáveis pelo usuário.

Principais práticas:

- Page Object Model;
- locators semânticos e `data-testid`;
- assertions web-first;
- autenticação reutilizável por fixture;
- cenários independentes;
- ausência de esperas fixas;
- execução em navegador real.

### Testes de API

Os testes de API validam os serviços diretamente, sem dependência da interface.

Principais práticas:

- client por domínio;
- validação de status e corpo;
- contratos de resposta;
- cenários positivos e negativos;
- factories para dados únicos;
- reaproveitamento controlado de IDs entre steps;
- restauração das massas quando necessário.

### Classificação por tags

| Tag | Finalidade |
| --- | --- |
| `@web` | Cenários da interface Web |
| `@api` | Cenários da API |
| `@smoke` | Validação rápida dos fluxos críticos |
| `@regression` | Cobertura funcional de regressão |
| `@positive` | Fluxos esperados |
| `@negative` | Validações de erro |
| `@auth` | Autenticação e sessão |
| `@people` | Domínio de pessoas |
| `@movies` | Domínio de filmes |

## Pré-requisitos

- Node.js 22 ou superior;
- npm;
- Docker Desktop;
- Git.

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

Inicie o PostgreSQL e o pgAdmin:

```powershell
npm run stack:up
```

Prepare o Prisma e o banco de dados:

```powershell
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

## Serviços locais

| Serviço | Endereço |
| --- | --- |
| Aplicação Web | `http://localhost:3100` |
| API REST | `http://localhost:3030/api` |
| Health check | `http://localhost:3030/api/health` |
| PostgreSQL | `localhost:5435` |
| pgAdmin | `http://localhost:15435` |

### Credenciais da aplicação

```text
E-mail: qa@adminlab.com
Senha: pwd123
```

## Execução dos testes

### Executar todos os cenários BDD

```powershell
npm run test:bdd
```

### Executar com o navegador visível

```powershell
npm run test:bdd:headed
```

### Abrir os testes Web no Playwright UI

```powershell
npm run test:web:ui
```

### Abrir os testes de API no Playwright UI

```powershell
npm run test:api:ui
```

### Executar o smoke test

```powershell
npm run test:smoke
```

### Executar um CT específico

Primeiro, gere os testes BDD:

```powershell
npm run bdd:generate
```

Depois, filtre pela identificação do cenário:

```powershell
npx playwright test --project=bdd-chromium --grep "CT-WEB-PEOPLE-002"
```

### Abrir o último relatório

```powershell
npm run test:e2e:report
```

## Evidências de execução

O Playwright pode gerar:

- relatório HTML;
- screenshots em falhas;
- traces para investigação;
- resultados em JSON;
- logs da API.

O badge no início deste README fornece acesso ao relatório publicado da automação.

## Princípios adotados

- cenários independentes e legíveis;
- steps pequenos e focados na intenção;
- seletores encapsulados nos Page Objects;
- requisições encapsuladas nos API Clients;
- dados isolados por cenário;
- validações Web com auto-wait;
- ausência de `waitForTimeout`;
- arquivos gerados pelo BDD fora do código-fonte;
- evidências preservadas para investigação.

## Documentação complementar

- `docs/PLAYWRIGHT-BDD-ARCHITECTURE.md`
- `docs/TEST-DATA.md`
- `docs/PROJECT-READINESS-REVIEW.md`
- `bruno/LEIA-ME.md`

## Status do projeto

> 🟢 **Em evolução** — Automação Web e API organizada por domínio, com execução BDD, banco de dados local e geração de evidências.
