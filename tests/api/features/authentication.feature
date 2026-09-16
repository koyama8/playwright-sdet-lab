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
