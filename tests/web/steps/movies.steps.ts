import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/web.fixture';
import { createValidMovieData } from '../data/factories/movies.factory';

const { Given, When, Then } = createBdd(test);

When('o usuário acessa a página de filmes', async ({ moviesPage }) => {
  await moviesPage.acessarPaginaFilmes();
});

Then('o usuário deve visualizar a listagem de filmes cadastrados', async ({ moviesPage }) => {
  await moviesPage.validarPrimeiroFilmeVisivel();
});

When('clica no botão "Novo filme"', async ({ moviesPage }) => {
  await moviesPage.clicarVerFilme();
});

When('informa os dados válidos do filme', async ({ moviesPage, contextoFilmes }) => {
  const filme = createValidMovieData();

  contextoFilmes.filme = filme;

  await moviesPage.preencherDadosDoFilme(filme);
});

When('confirma o cadastro do filme', async ({ moviesPage }) => {
  await moviesPage.salvarFilme();
});

Then('o usuário deve visualizar o novo filme na listagem', async ({ moviesPage, contextoFilmes }) => {
  const filme = contextoFilmes.filme;

  if (!filme) {
    throw new Error('Os dados do filme não foram preparados.');
  }

  await moviesPage.validarFilmeCadastrado(filme.title);
});

Given('o filme "Interestelar" está cadastrado no catálogo', async ({ moviesPage }) => {
  await moviesPage.validarTituloFilme();
});

When('clica em "Editar" no filme "Interestelar"', async ({ moviesPage }) => {
  await moviesPage.clicarEditarFilme();
});

When('altera o título para "Interestelar - Edição Especial"', async ({ moviesPage }) => {
  await moviesPage.editarFilme();
});

When('clica no botão "Salvar filme"', async ({ moviesPage }) => {
  await moviesPage.salvarFilmeEditado();
});

Then('deve visualizar o filme com o título exato "Interestelar - Edição Especial"', async ({ moviesPage }) => {
  await moviesPage.visualizarFilme();
});
