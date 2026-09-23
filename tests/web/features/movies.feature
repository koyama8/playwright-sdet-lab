@web @movies
Feature: Filmes Web
    Como usuário autenticado no Playwright Lab
    Quero acessar os filmes cadastrados
    Para visualizar o catálogo disponível no sistema

    @CT_WEB_MOVIES_001 @smoke @positive
    Scenario: CT-WEB-MOVIES-001 - Visualizar filmes cadastrados
        Given que o usuário está autenticado no sistema
        When o usuário acessa a página de filmes
        Then o usuário deve visualizar a listagem de filmes cadastrados

    @CT_WEB_MOVIES_002 @positive
    Scenario: CT-WEB-MOVIES-002 - Cadastrar um novo filme
        Given que o usuário está autenticado no sistema
        When o usuário acessa a página de filmes
        And clica no botão "Novo filme"
        And informa os dados válidos do filme
        And confirma o cadastro do filme
        Then o usuário deve visualizar o novo filme na listagem
