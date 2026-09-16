import { createBdd } from 'playwright-bdd';
import { validarLoginComSucesso } from '../contracts/authentication.contract';
import { credenciaisValidas } from '../data/payloads/authentication.payload';
import { test } from '../fixtures/api.fixture';

const { Given, When, Then } = createBdd(test);

Given('que possuo credenciais válidas para autenticação na API', ({ contextoAutenticacao }) => {
  contextoAutenticacao.credenciais = credenciaisValidas;
});

When(
  'envio uma requisição POST para o endpoint de login',
  async ({ authenticationClient, contextoAutenticacao }) => {
    const credenciais = contextoAutenticacao.credenciais;

    if (!credenciais) {
      throw new Error('As credenciais não foram preparadas.');
    }

    contextoAutenticacao.resposta = await authenticationClient.realizarLogin(credenciais);
  },
);

When('recebo a resposta da autenticação', async ({ contextoAutenticacao }) => {
  const resposta = contextoAutenticacao.resposta;

  if (!resposta) {
    throw new Error('As credenciais não foram preparadas.');
  }

  contextoAutenticacao.corpoResposta = await resposta.json();
});

Then(
  'a API deve retornar status 200 com os dados do usuário e os tokens de autenticação',
  ({ contextoAutenticacao }) => {
    validarLoginComSucesso(
      contextoAutenticacao.corpoResposta,
      contextoAutenticacao.resposta!.status(),
    );
  },
);
