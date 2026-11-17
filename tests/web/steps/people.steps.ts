import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/web.fixture';

const { When, Then } = createBdd(test);

When('o usuário acessa a página de pessoas', async ({ peoplePage }) => {
  await peoplePage.acessarPaginaPessoas();
});

Then('o usuário deve visualizar a listagem de pessoas cadastradas', async ({ peoplePage }) => {
  await peoplePage.validarPrimeiraPessoaVisivel();
});

When('o usuário busca pela pessoa {string}', async ({ peoplePage }, nomePessoa: string) => {
  await peoplePage.buscarPessoa(nomePessoa);
});

Then('deve visualizar somente a pessoa {string} nos resultados', async ({ peoplePage }, nomePessoa: string) => {
  await peoplePage.validarResultadoBusca(nomePessoa);
});
