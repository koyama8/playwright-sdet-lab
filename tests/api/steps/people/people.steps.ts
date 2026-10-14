import { createBdd } from 'playwright-bdd';
import { test } from '../../fixtures/api.fixture';
import { validarListagem, validarCadastro } from '../../contracts/people/people.contract';
import { createValidPersonApiData } from '../../data/factories/people/people.factory';

const { Given, When, Then } = createBdd(test);

When('envio uma requisição GET para o endpoint de pessoas', async ({ peopleClient, contextoAutenticacao, contextoPeople }) => {
  const tokenAcesso = contextoAutenticacao.tokenAcesso;

  if (!tokenAcesso) {
    throw new Error('O token de acesso não foi preparado.');
  }

  contextoPeople.resposta = await peopleClient.listarPessoas(tokenAcesso);
});

When('recebo a resposta da consulta de pessoas', async ({ contextoPeople }) => {
  const resposta = contextoPeople.resposta;

  if (!resposta) {
    throw new Error('A resposta da consulta de pessoas não foi recebida.');
  }

  contextoPeople.corpoResposta = await resposta.json();
});

Then('a API deve retornar status 200 com a lista de pessoas cadastradas', async ({ contextoPeople }) => {
  const resposta = contextoPeople.resposta;

  if (!resposta) {
    throw new Error('A resposta da consulta de pessoas não foi recebida.');
  }

  validarListagem(resposta.status());
});

Given('possuo dados válidos para cadastrar uma pessoa', async ({ contextoPeople }) => {
  const pessoa = createValidPersonApiData();

  contextoPeople.pessoa = pessoa;
});

When('envio uma requisição POST para o endpoint de pessoas', async ({ peopleClient, contextoAutenticacao, contextoPeople }) => {
  const tokenAcesso = contextoAutenticacao.tokenAcesso;
  const pessoa = contextoPeople.pessoa;

  if (!tokenAcesso) {
    throw new Error('O token de acesso não foi preparado.');
  }

  if (!pessoa) {
    throw new Error('Os dados da pessoa não foram preparados.');
  }

  contextoPeople.resposta = await peopleClient.cadastrarPessoa(tokenAcesso, pessoa);
});

When('recebo a resposta do cadastro da pessoa', async ({ contextoPeople }) => {
  const resposta = contextoPeople.resposta;

  if (!resposta) {
    throw new Error('A resposta do cadastro da pessoa não foi recebida.');
  }

  contextoPeople.corpoResposta = await resposta.json();
});

Then('a API deve retornar status 201 com os dados da pessoa cadastrada', async ({ contextoPeople }) => {
  const resposta = contextoPeople.resposta;
  const corpoResposta = contextoPeople.corpoResposta;
  const pessoa = contextoPeople.pessoa;

  if (!resposta) {
    throw new Error('A resposta do cadastro da pessoa não foi recebida.');
  }
  if (!pessoa) {
    throw new Error('Os dados da pessoa não foram preparados.');
  }

  validarCadastro(corpoResposta, resposta.status(), pessoa);
});
