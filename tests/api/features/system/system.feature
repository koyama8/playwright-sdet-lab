@api @system
Feature: Sistema da API
    Como administrador da API do Playwright Lab
    Quero restaurar as massas de demonstração
    Para manter o ambiente de testes em um estado conhecido

    @CT_API_SYSTEM_001 @positive
    Scenario: CT-API-SYSTEM-001 - Restaurar massas de demonstração
        Given que possuo um token de acesso válido
        When envio uma requisição POST para restaurar as massas de demonstração
        And recebo a resposta da restauração das massas
        Then a API deve retornar status 200 com as massas restauradas
