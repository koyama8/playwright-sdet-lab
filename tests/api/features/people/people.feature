@api @people
Feature: Pessoas da API
    Como consumidor autenticado da API do Playwright Lab
    Quero consultar as pessoas cadastradas
    Para visualizar os registros disponíveis no sistema

    @CT_API_PEOPLE_001 @smoke @positive
    Scenario: CT-API-PEOPLE-001 - Listar pessoas cadastradas
        Given que possuo um token de acesso válido
        When envio uma requisição GET para o endpoint de pessoas
        And recebo a resposta da consulta de pessoas
        Then a API deve retornar status 200 com a lista de pessoas cadastradas

    @CT_API_PEOPLE_002 @positive
    Scenario: CT-API-PEOPLE-002 - Cadastrar uma nova pessoa
        Given que possuo um token de acesso válido
        And possuo dados válidos para cadastrar uma pessoa
        When envio uma requisição POST para o endpoint de pessoas
        And recebo a resposta do cadastro da pessoa
        Then a API deve retornar status 201 com os dados da pessoa cadastrada
