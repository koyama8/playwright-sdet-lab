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

    @CT_API_MOVIES_003 @positive
    Scenario: CT-API-MOVIES-003 - Buscar filme cadastrado por ID
        Given que possuo um token de acesso válido
        And possuo um filme cadastrado na API
        When envio uma requisição GET para o endpoint do filme cadastrado
        And recebo a resposta da consulta do filme
        Then a API deve retornar status 200 com os dados do filme cadastrado

    @CT_API_MOVIES_004 @positive
    Scenario: CT-API-MOVIES-004 - Atualizar filme cadastrado
        Given que possuo um token de acesso válido
        And cadastro um novo filme para realizar a atualização
        And possuo novos dados válidos para atualizar o filme
        When envio uma requisição PATCH para o endpoint do filme cadastrado
        And recebo a resposta da atualização do filme
        Then a API deve retornar status 200 com os dados atualizados do filme

    @CT_API_MOVIES_005 @positive
    Scenario: CT-API-MOVIES-005 - Excluir filme cadastrado
        Given que possuo um token de acesso válido
        And possuo um filme cadastrado na API
        When envio uma requisição DELETE para o endpoint do filme cadastrado
        And recebo a resposta da exclusão do filme
        Then a API deve retornar status 200 com a mensagem de exclusão

    @CT_API_MOVIES_006 @positive
    Scenario: CT-API-MOVIES-006 - Listar filmes favoritos
        Given que possuo um token de acesso válido
        And possuo um filme favorito cadastrado na API
        When envio uma requisição GET para o endpoint de filmes favoritos
        And recebo a resposta da listagem de filmes favoritos
        Then a API deve retornar status 200 com a lista de filmes favoritos
