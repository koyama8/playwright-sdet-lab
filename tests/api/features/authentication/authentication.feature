@api @authentication
Feature: Autenticação da API
    Como consumidor da API do Playwright Lab
    Quero realizar autenticação no sistema
    Para acessar os recursos protegidos

    @CT_API_AUTH_001 @smoke @positive
    Scenario: CT-API-AUTH-001 - Realizar login com credenciais válidas
        Given que possuo credenciais válidas para autenticação na API
        When envio uma requisição POST para o endpoint de login
        And recebo a resposta da autenticação
        Then a API deve retornar status 200 com os dados do usuário e os tokens de autenticação

    @CT_API_AUTH_002 @negative
    Scenario: CT-API-AUTH-002 - Não realizar login com credenciais inválidas
        Given que possuo credenciais inválidas para autenticação na API
        When envio uma requisição POST para o endpoint de login
        And recebo a resposta da autenticação
        Then a API deve retornar status 401 com a mensagem de credenciais inválidas

    @CT_API_AUTH_003 @positive
    Scenario: CT-API-AUTH-003 - Consultar usuário autenticado
        Given que possuo um token de acesso válido
        When envio uma requisição GET para o endpoint do usuário autenticado
        And recebo a resposta da consulta do usuário
        Then a API deve retornar status 200 com os dados do usuário autenticado
