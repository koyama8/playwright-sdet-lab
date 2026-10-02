import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/api.fixture';
import { validarRestauracaoMassas } from '../contracts/system.contract';

const { When, Then } = createBdd(test);

When(
  'envio uma requisição POST para restaurar as massas de demonstração',
  async ({ systemClient, contextoAutenticacao, contextoSystem }) => {
    const tokenAcesso = contextoAutenticacao.tokenAcesso;

    if (!tokenAcesso) {
      throw new Error('O token de acesso não foi preparado.');
    }

    contextoSystem.resposta = await systemClient.restaurarMassa(tokenAcesso);
  },
);

When('recebo a resposta da restauração das massas', async ({ contextoSystem }) => {
  const resposta = contextoSystem.resposta;

  if (!resposta) {
    throw new Error('As credenciais não foram preparadas.');
  }

  contextoSystem.corpoResposta = await resposta.json();
});

Then('a API deve retornar status 200 com as massas restauradas', async ({ contextoSystem }) => {
  const resposta = contextoSystem.resposta;
  const corpoResposta = await contextoSystem.corpoResposta;

  if (!resposta) {
    throw new Error('As credenciais não foram preparadas.');
  }

  if (corpoResposta === undefined) {
    throw new Error('O corpo da resposta da restauração não foi preparado.');
  }

  validarRestauracaoMassas(corpoResposta, resposta.status());
});
