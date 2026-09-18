import { createBdd } from 'playwright-bdd';
import { validarLoginComSucesso, validarLoginInvalido, validarAuthenticado } from '../contracts/authentication.contract';
import { credenciaisInvalidas, credenciaisValidas } from '../data/payloads/authentication.payload';
import { test } from '../fixtures/api.fixture';

const { Given, When, Then } = createBdd(test);

Given('que possuo credenciais válidas para autenticação na API', ({ contextoAutenticacao }) => {
  contextoAutenticacao.credenciais = credenciaisValidas;
});

When('envio uma requisição POST para o endpoint de login', async ({ authenticationClient, contextoAutenticacao }) => {
  const credenciais = contextoAutenticacao.credenciais;

  if (!credenciais) {
    throw new Error('As credenciais não foram preparadas.');
  }

  contextoAutenticacao.resposta = await authenticationClient.realizarLogin(credenciais);
});

When('recebo a resposta da autenticação', async ({ contextoAutenticacao }) => {
  const resposta = contextoAutenticacao.resposta;

  if (!resposta) {
    throw new Error('As credenciais não foram preparadas.');
  }

  contextoAutenticacao.corpoResposta = await resposta.json();
});

Then('a API deve retornar status 200 com os dados do usuário e os tokens de autenticação', ({ contextoAutenticacao }) => {
  validarLoginComSucesso(contextoAutenticacao.corpoResposta, contextoAutenticacao.resposta!.status());
});

Given('que possuo credenciais inválidas para autenticação na API', ({ contextoAutenticacao }) => {
  contextoAutenticacao.credenciais = credenciaisInvalidas;
});

Then('a API deve retornar status 401 com a mensagem de credenciais inválidas', ({ contextoAutenticacao }) => {
  validarLoginInvalido(contextoAutenticacao.corpoResposta, contextoAutenticacao.resposta!.status());
});

Given('que possuo um token de acesso válido', async ({ authenticationClient, contextoAutenticacao }) => {
  const respostaLogin = await authenticationClient.realizarLogin(credenciaisValidas);
  const corpoLogin = await respostaLogin.json();

  contextoAutenticacao.tokenAcesso = corpoLogin.data.accessToken;
});

When('envio uma requisição GET para o endpoint do usuário autenticado', async ({ authenticationClient, contextoAutenticacao }) => {
  const tokenAcesso = contextoAutenticacao.tokenAcesso;

  if (!tokenAcesso) {
    throw new Error('O token de acesso não foi preparado.');
  }

  contextoAutenticacao.resposta = await authenticationClient.usuarioAuthenticado(tokenAcesso);
});

When('recebo a resposta da consulta do usuário', async ({ contextoAutenticacao }) => {
  const resposta = contextoAutenticacao.resposta;

  if (!resposta) {
    throw new Error('As credenciais não foram preparadas.');
  }

  contextoAutenticacao.corpoResposta = await resposta.json();
});

Then('a API deve retornar status 200 com os dados do usuário autenticado', ({ contextoAutenticacao }) => {
  validarAuthenticado(contextoAutenticacao.corpoResposta, contextoAutenticacao.resposta!.status());
});
