import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/api.fixture';
import { validarListagemFilmes, validarCadastroFilme } from '../contracts/movies.contract';
import { createValidMovieApiData, type MovieApiTestData } from '../data/factories/movies.factory';

const { Given, When, Then } = createBdd(test);

When('envio uma requisição GET para o endpoint de filmes', async ({ moviesClient, contextoAutenticacao, contextoMovies }) => {
  const tokenAcesso = contextoAutenticacao.tokenAcesso;

  if (!tokenAcesso) {
    throw new Error('O token de acesso não foi preparado.');
  }

  contextoMovies.resposta = await moviesClient.listarFilme(tokenAcesso);
});

When('recebo a resposta da consulta de filmes', async ({ contextoMovies }) => {
  const resposta = contextoMovies.resposta;

  if (!resposta) {
    throw new Error('As credenciais não foram preparadas.');
  }

  contextoMovies.corpoResposta = await resposta.json();
});

Then('a API deve retornar status 200 com a lista de filmes cadastrados', async ({ contextoMovies }) => {
  const resposta = contextoMovies.resposta;

  if (!resposta) {
    throw new Error('A resposta da consulta de filmes não foi recebida.');
  }

  validarListagemFilmes(resposta.status());
});

Given('possuo dados válidos para cadastrar um filme', async ({ contextoMovies }) => {
  const filme = createValidMovieApiData();

  contextoMovies.filme = filme;
});

When('envio uma requisição POST para o endpoint de filmes', async ({ moviesClient, contextoAutenticacao, contextoMovies }) => {
  const tokenAcesso = contextoAutenticacao.tokenAcesso;
  const filme = contextoMovies.filme;

  if (!tokenAcesso) {
    throw new Error('O token de acesso não foi preparado.');
  }

  if (!filme) {
    throw new Error('Os dados do filme não foram preparados.');
  }

  contextoMovies.resposta = await moviesClient.cadastrarFilme(tokenAcesso, filme);
});

When('recebo a resposta do cadastro do filme', async ({ contextoMovies }) => {
  const resposta = contextoMovies.resposta;

  if (!resposta) {
    throw new Error('As credenciais não foram preparadas.');
  }

  contextoMovies.corpoResposta = await resposta.json();
});

Then('a API deve retornar status 201 com os dados do filme cadastrado', async ({ contextoMovies }) => {
  const resposta = contextoMovies.resposta;
  const corpoResposta = contextoMovies.corpoResposta;
  const filme = contextoMovies.filme;

  if (!resposta) {
    throw new Error('A resposta da consulta de filmes não foi recebida.');
  }
  if (!filme) {
    throw new Error('Os dados do filme não foram preparados.');
  }
  validarCadastroFilme(corpoResposta, resposta.status(), filme);
});
