import { createBdd } from 'playwright-bdd';
import { credenciaisInvalidas, credenciaisValidas } from '../data/authentication.data';
import { test } from '../fixtures/web.fixture';

const { Given, When, Then } = createBdd(test);

Given('que o usuário está na página de login', async ({ authenticationPage }) => {
  await authenticationPage.acessarPaginaLogin();
});

When('o usuário informa credenciais válidas', async ({ authenticationPage }) => {
  await authenticationPage.preencherCredenciais(
    credenciaisValidas.email,
    credenciaisValidas.senha,
  );
});

When('clica no botão "Entrar"', async ({ authenticationPage }) => {
  await authenticationPage.clicarBotaoEntrar();
});

Then(
  'o usuário deve ser direcionado para o dashboard e visualizar sua identificação no sistema',
  async ({ authenticationPage }) => {
    await authenticationPage.validarLoginComSucesso();
  },
);

When('o usuário informa credenciais inválidas', async ({ authenticationPage }) => {
  await authenticationPage.preencherCredenciais(
    credenciaisInvalidas.email,
    credenciaisInvalidas.senha,
  );
});

Then(
  'o usuário deve permanecer na página de login e visualizar a mensagem de credenciais inválidas',
  async ({ authenticationPage }) => {
    await authenticationPage.validarCredenciaisInvalidas();
  },
);

Given('que o usuário está autenticado no sistema', async ({ authenticationPage }) => {
  await authenticationPage.autenticarUsuario(
    credenciaisValidas.email,
    credenciaisValidas.senha,
  );
});

When('o usuário permanece sem realizar nenhuma atividade', async ({ authenticationPage }) => {
  await authenticationPage.simularPeriodoInativo();
});

When('o tempo limite de dez minutos da sessão é atingido', async ({ authenticationPage }) => {
  await authenticationPage.atingirTempoLimiteSessao();
});

Then(
  'o usuário deve ser redirecionado para a página de login e visualizar a notificação de sessão expirada',
  async ({ authenticationPage }) => {
    await authenticationPage.validarSessaoExpirada();
  },
);
