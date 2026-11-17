@web @people
Feature: Pessoas Web
    Como usuário autenticado no Playwright Lab
    Quero acessar as pessoas cadastradas
    Para visualizar os registros disponíveis no sistema

    @CT_WEB_PEOPLE_001 @smoke @positive
    Scenario: CT-WEB-PEOPLE-001 - Visualizar pessoas cadastradas
        Given que o usuário está autenticado no sistema
        When o usuário acessa a página de pessoas
        Then o usuário deve visualizar a listagem de pessoas cadastradas

    @CT_WEB_PEOPLE_002 @regression @positive
    Scenario: CT-WEB-PEOPLE-002 - Buscar pessoa pelo nome
        Given que o usuário está autenticado no sistema
        And o usuário acessa a página de pessoas
        When o usuário busca pela pessoa "Elisa Rocha"
        Then deve visualizar somente a pessoa "Elisa Rocha" nos resultados
