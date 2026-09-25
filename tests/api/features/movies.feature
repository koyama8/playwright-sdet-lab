@api @movies
Feature: Filmes da API
    Como consumidor autenticado da API do Playwright Lab
    Quero consultar os filmes cadastrados
    Para visualizar o catálogo disponível no sistema

    @CT_API_MOVIES_001 @smoke @positive
    Scenario: CT-API-MOVIES-001 - Listar filmes cadastrados
        Given que possuo um token de acesso válido
        When envio uma requisição GET para o endpoint de filmes
        And recebo a resposta da consulta de filmes
        Then a API deve retornar status 200 com a lista de filmes cadastrados

    @CT_API_MOVIES_002 @positive
    Scenario: CT-API-MOVIES-002 - Cadastrar um novo filme
        Given que possuo um token de acesso válido
        And possuo dados válidos para cadastrar um filme
        When envio uma requisição POST para o endpoint de filmes
        And recebo a resposta do cadastro do filme
        Then a API deve retornar status 201 com os dados do filme cadastrado