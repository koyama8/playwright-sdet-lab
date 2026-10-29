import { createBdd } from 'playwright-bdd';
import { test } from '../../fixtures/api.fixture';
import {
  validarListagem,
  validarCadastro,
  validarBusca,
  validarAtualizacao,
  validarDados,
  validarExclusao,
} from '../../contracts/people/people.contract';
import { createValidPersonApiData, createValidPersonUpdateApiData } from '../../data/factories/people/people.factory';

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

Given('possuo uma pessoa cadastrada na API', async ({ peopleClient, contextoAutenticacao, contextoPeople }) => {
  const tokenAceso = contextoAutenticacao.tokenAcesso;

  if (!tokenAceso) {
    throw new Error('O token de acesso não foi preparado.');
  }

  const pessoa = createValidPersonApiData();
  const resposta = await peopleClient.cadastrarPessoa(tokenAceso, pessoa);

  const corpoResposta = await resposta.json();

  contextoPeople.pessoa = pessoa;
  contextoPeople.pessoaId = corpoResposta.data.id;
});

When('envio uma requisição GET para o endpoint da pessoa cadastrada', async ({ peopleClient, contextoAutenticacao, contextoPeople }) => {
  const tokenAcesso = contextoAutenticacao.tokenAcesso;
  const pessoaId = contextoPeople.pessoaId;

  if (!tokenAcesso) {
    throw new Error('O token de acesso não foi preparado.');
  }

  if (!pessoaId) {
    throw new Error('O ID da pessoa não foi preparado.');
  }

  contextoPeople.resposta = await peopleClient.buscarPessoa(tokenAcesso, pessoaId);
});

When('recebo a resposta da consulta da pessoa', async ({ contextoPeople }) => {
  const resposta = contextoPeople.resposta;

  if (!resposta) {
    throw new Error('A resposta do cadastro da pessoa não foi recebida.');
  }

  contextoPeople.corpoResposta = await resposta.json();
});

Then('a API deve retornar status 200 com os dados da pessoa cadastrada', ({ contextoPeople }) => {
  const resposta = contextoPeople.resposta;
  const corpoResposta = contextoPeople.corpoResposta;
  const pessoa = contextoPeople.pessoa;

  if (!resposta) {
    throw new Error('A resposta da consulta da pessoa não foi recebida.');
  }

  if (!pessoa) {
    throw new Error('Os dados da pessoa não foram preparados.');
  }

  validarBusca(corpoResposta, resposta.status(), pessoa);
});

Given('cadastro uma nova pessoa para realizar a atualização', async ({ peopleClient, contextoAutenticacao, contextoPeople }) => {
  const tokenAcesso = contextoAutenticacao.tokenAcesso;

  if (!tokenAcesso) {
    throw new Error('O token de acesso não foi preparado.');
  }

  const pessoa = createValidPersonApiData();
  const resposta = await peopleClient.cadastrarPessoa(tokenAcesso, pessoa);

  const corpoResposta = await resposta.json();

  contextoPeople.pessoa = pessoa;
  contextoPeople.pessoaId = corpoResposta.data.id;
});

Given('possuo novos dados válidos para atualizar a pessoa', async ({ contextoPeople }) => {
  const pessoalAtualiza = createValidPersonUpdateApiData();

  contextoPeople.dadosAtualizados = pessoalAtualiza;
});

When('envio uma requisição PATCH para o endpoint da pessoa cadastrada', async ({ peopleClient, contextoAutenticacao, contextoPeople }) => {
  const tokenAcesso = contextoAutenticacao.tokenAcesso;
  const pessoaId = contextoPeople.pessoaId;
  const pessoaAtualizado = contextoPeople.dadosAtualizados;

  if (!tokenAcesso) {
    throw new Error('O token de acesso não foi preparado.');
  }

  if (!pessoaId) {
    throw new Error('A pessoa ID não foi preparado.');
  }

  if (!pessoaAtualizado) {
    throw new Error('Os dados de atualização da pessoa não foram preparados.');
  }

  contextoPeople.resposta = await peopleClient.atualizaPessoa(tokenAcesso, pessoaId, pessoaAtualizado);
});

When('recebo a resposta da atualização da pessoa', async ({ contextoPeople }) => {
  const resposta = contextoPeople.resposta;

  if (!resposta) {
    throw new Error('A resposta do cadastro da pessoa não foi recebida.');
  }

  contextoPeople.corpoResposta = resposta.json();
});

Then('a API deve retornar status 200 com os dados atualizados da pessoa', async ({ contextoPeople }) => {
  const resposta = contextoPeople.resposta;

  if (!resposta) {
    throw new Error('A resposta do cadastro da pessoa não foi recebida.');
  }

  validarAtualizacao(resposta.status());
});

When(
  'envio uma requisição GET para o endpoint de pessoas com filtros de status, busca e paginação',
  async ({ peopleClient, contextoAutenticacao, contextoPeople }) => {
    const tokenAcesso = contextoAutenticacao.tokenAcesso;

    if (!tokenAcesso) {
      throw new Error('O token de acesso não foi preparado.');
    }

    contextoPeople.resposta = await peopleClient.filtrarPessoas(tokenAcesso);
  },
);

When('recebo a resposta da consulta de pessoas filtradas', async ({ contextoPeople }) => {
  const resposta = contextoPeople.resposta;

  if (!resposta) {
    throw new Error('A resposta do cadastro da pessoa não foi recebida.');
  }

  contextoPeople.corpoResposta = await resposta.json();
});

Then('a API deve retornar status 200 com a lista de pessoas filtradas', async ({ contextoPeople }) => {
  const resposta = contextoPeople.resposta;
  const corpoResposta = contextoPeople.corpoResposta;

  if (!resposta) {
    throw new Error('A resposta do cadastro da pessoa não foi recebida.');
  }

  validarDados(corpoResposta, resposta.status());
});

When('envio uma requisição DELETE para o endpoint da pessoa cadastrada', async ({ peopleClient, contextoAutenticacao, contextoPeople }) => {
  const tokenAcesso = contextoAutenticacao.tokenAcesso;
  const pessoaId = contextoPeople.pessoaId;

  if (!tokenAcesso) {
    throw new Error('O token de acesso não foi preparado.');
  }

  if (!pessoaId) {
    throw new Error('O ID da pessoa não foi preparado.');
  }

  contextoPeople.resposta = await peopleClient.deletarPessoa(tokenAcesso, pessoaId);
});

When('recebo a resposta da exclusão da pessoa', async ({ contextoPeople }) => {
  const resposta = contextoPeople.resposta;

  if (!resposta) {
    throw new Error('A resposta da exclusão da pessoa não foi recebida.');
  }

  contextoPeople.corpoResposta = await resposta.json();
});

Then('a API deve retornar status 200 com a mensagem de exclusão da pessoa', ({ contextoPeople }) => {
  const resposta = contextoPeople.resposta;
  const corpoResposta = contextoPeople.corpoResposta;

  if (!resposta) {
    throw new Error('A resposta da exclusão da pessoa não foi recebida.');
  }

  validarExclusao(corpoResposta, resposta.status());
});
