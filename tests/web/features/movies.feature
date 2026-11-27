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

    @CT_WEB_MOVIES_003 @positive
    Scenario: CT-WEB-MOVIES-003 - Editar o título de Interestelar e verificar a persistência
        Given que o usuário está autenticado no sistema
        And o usuário acessa a página de filmes
        And o filme "Interestelar" está cadastrado no catálogo
        When clica em "Editar" no filme "Interestelar"
        And altera o título para "Interestelar - Edição Especial"
        And clica no botão "Salvar filme"
        And recarrega a página de filmes
        Then deve visualizar o filme com o título exato "Interestelar - Edição Especial"
