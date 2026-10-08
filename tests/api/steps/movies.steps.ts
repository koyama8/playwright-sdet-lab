import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/api.fixture';
import {
  validarListagemFilmes,
  validarCadastroFilme,
  validarBuscarFilme,
  validarAtualizacaoFilme,
  validarDeletarFilme,
  validarListagemFavoritos,
  validarFilmeInvalido,
  validarPaginacaoInvalida,
} from '../contracts/movies.contract';
import {
  createValidMovieApiData,
  createValidMovieUpdateApiData,
  createFavoriteMovieApiData,
  createInvalidMovieApiData,
  type MovieApiTestData,
} from '../data/factories/movies.factory';

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

Given('possuo um filme cadastrado na API', async ({ moviesClient, contextoAutenticacao, contextoMovies }) => {
  const tokenAcesso = contextoAutenticacao.tokenAcesso;

  if (!tokenAcesso) {
    throw new Error('O token de acesso não foi preparado.');
  }

  const filme = createValidMovieApiData();
  const resposta = await moviesClient.cadastrarFilme(tokenAcesso, filme);

  const corpoResposta = await resposta.json();

  contextoMovies.filme = filme;
  contextoMovies.filmeId = corpoResposta.data.id;
});

When('envio uma requisição GET para o endpoint do filme cadastrado', async ({ moviesClient, contextoAutenticacao, contextoMovies }) => {
  const tokenAcesso = contextoAutenticacao.tokenAcesso;
  const filmeId = contextoMovies.filmeId;

  if (!tokenAcesso) {
    throw new Error('O token de acesso não foi preparado.');
  }

  if (!filmeId) {
    throw new Error('O ID do filme não foi preparado.');
  }

  contextoMovies.resposta = await moviesClient.buscarFilme(tokenAcesso, filmeId);
});

When('recebo a resposta da consulta do filme', async ({ contextoMovies }) => {
  const resposta = contextoMovies.resposta;

  if (!resposta) {
    throw new Error('A resposta da consulta do filme não foi recebida.');
  }

  contextoMovies.corpoResposta = await resposta.json();
});

Then('a API deve retornar status 200 com os dados do filme cadastrado', async ({ contextoMovies }) => {
  const resposta = contextoMovies.resposta;

  if (!resposta) {
    throw new Error('A resposta da consulta de filmes não foi recebida.');
  }

  validarBuscarFilme(resposta.status());
});

Given('cadastro um novo filme para realizar a atualização', async ({ moviesClient, contextoAutenticacao, contextoMovies }) => {
  const tokenAcesso = contextoAutenticacao.tokenAcesso;

  if (!tokenAcesso) {
    throw new Error('O token de acesso não foi preparado.');
  }

  const filme = createValidMovieApiData();
  const resposta = await moviesClient.cadastrarFilme(tokenAcesso, filme);

  const corpoResposta = await resposta.json();

  contextoMovies.filme = filme;
  contextoMovies.filmeId = corpoResposta.data.id;
});

Given('possuo novos dados válidos para atualizar o filme', async ({ contextoMovies }) => {
  const filmeAtualizado = createValidMovieUpdateApiData();

  contextoMovies.dadosAtualizacao = filmeAtualizado;
});

When('envio uma requisição PATCH para o endpoint do filme cadastrado', async ({ moviesClient, contextoAutenticacao, contextoMovies }) => {
  const tokenAcesso = contextoAutenticacao.tokenAcesso;
  const filmeId = contextoMovies.filmeId;
  const filmeAtualizado = contextoMovies.dadosAtualizacao;

  if (!tokenAcesso) {
    throw new Error('O token de acesso não foi preparado.');
  }

  if (!filmeId) {
    throw new Error('O ID do filme não foi preparado.');
  }

  if (!filmeAtualizado) {
    throw new Error('Os dados de atualização do filme não foram preparados.');
  }

  contextoMovies.resposta = await moviesClient.atualizarFilme(tokenAcesso, filmeId, filmeAtualizado);
});

When('recebo a resposta da atualização do filme', async ({ contextoMovies }) => {
  const resposta = contextoMovies.resposta;

  if (!resposta) {
    throw new Error('A resposta da consulta do filme não foi recebida.');
  }

  contextoMovies.corpoResposta = await resposta.json();
});

Then('a API deve retornar status 200 com os dados atualizados do filme', async ({ contextoMovies }) => {
  const resposta = contextoMovies.resposta;
  const corporesposta = contextoMovies.corpoResposta;
  const filmeAtualizado = contextoMovies.dadosAtualizacao;

  if (!resposta) {
    throw new Error('A resposta da consulta de filmes não foi recebida.');
  }

  if (!filmeAtualizado) {
    throw new Error('Os dados do filme não foram preparados.');
  }

  validarAtualizacaoFilme(corporesposta, resposta.status(), filmeAtualizado);
});

When('envio uma requisição DELETE para o endpoint do filme cadastrado', async ({ moviesClient, contextoAutenticacao, contextoMovies }) => {
  const tokenAcesso = contextoAutenticacao.tokenAcesso;
  const filmeId = contextoMovies.filmeId;

  if (!tokenAcesso) {
    throw new Error('O token de acesso não foi preparado.');
  }

  if (!filmeId) {
    throw new Error('O ID do filme não foi preparado.');
  }

  contextoMovies.resposta = await moviesClient.excluirFilme(tokenAcesso, filmeId);
});

When('recebo a resposta da exclusão do filme', async ({ contextoMovies }) => {
  const resposta = contextoMovies.resposta;

  if (!resposta) {
    throw new Error('A resposta da consulta do filme não foi recebida.');
  }

  contextoMovies.corpoResposta = await resposta.json();
});

Then('a API deve retornar status 200 com a mensagem de exclusão', async ({ contextoMovies }) => {
  const resposta = contextoMovies.resposta;
  const corpoResposta = contextoMovies.corpoResposta;

  if (!resposta) {
    throw new Error('A resposta da consulta de filmes não foi recebida.');
  }

  validarDeletarFilme(corpoResposta, resposta.status());
});

Given('possuo um filme favorito cadastrado na API', async ({ moviesClient, contextoAutenticacao, contextoMovies }) => {
  const tokenAcesso = contextoAutenticacao.tokenAcesso;

  if (!tokenAcesso) {
    throw new Error('O token de acesso não foi preparado.');
  }

  const filme = createFavoriteMovieApiData();
  await moviesClient.cadastrarFilme(tokenAcesso, filme);

  contextoMovies.filme = filme;
});

When('envio uma requisição GET para o endpoint de filmes favoritos', async ({ moviesClient, contextoAutenticacao, contextoMovies }) => {
  const tokenAcesso = contextoAutenticacao.tokenAcesso;

  if (!tokenAcesso) {
    throw new Error('O token de acesso não foi preparado.');
  }

  contextoMovies.resposta = await moviesClient.listarFavoritos(tokenAcesso);
});

When('recebo a resposta da listagem de filmes favoritos', async ({ contextoMovies }) => {
  const resposta = contextoMovies.resposta;

  if (!resposta) {
    throw new Error('As credenciais não foram preparadas.');
  }

  contextoMovies.corpoResposta = await resposta.json();
});

Then('a API deve retornar status 200 com a lista de filmes favoritos', async ({ contextoMovies }) => {
  const resposta = contextoMovies.resposta;

  if (!resposta) {
    throw new Error('As credenciais não foram preparadas.');
  }

  validarListagemFavoritos(resposta.status());
});

Given('possuo dados inválidos para cadastrar um filme', async ({ contextoMovies }) => {
  const filme = createInvalidMovieApiData();

  contextoMovies.filme = filme;
});

When(
  'envio uma requisição POST com dados inválidos para o endpoint de filmes',
  async ({ moviesClient, contextoAutenticacao, contextoMovies }) => {
    const tokenAcesso = contextoAutenticacao.tokenAcesso;
    const filme = contextoMovies.filme;

    if (!tokenAcesso) {
      throw new Error('O token de acesso não foi preparado.');
    }

    if (!filme) {
      throw new Error('Os dados do filme não foram preparados.');
    }

    contextoMovies.resposta = await moviesClient.rejeitarFilme(tokenAcesso, filme);
  },
);

When('recebo a resposta do cadastro do filme com dados inválidos', async ({ contextoMovies }) => {
  const resposta = contextoMovies.resposta;

  if (!resposta) {
    throw new Error('A resposta da consulta do filme não foi recebida.');
  }

  contextoMovies.corpoResposta = await resposta.json();
});

Then('a API deve retornar status 400 com os detalhes do erro de validação', async ({ contextoMovies }) => {
  const resposta = contextoMovies.resposta;
  const corpoResposta = contextoMovies.corpoResposta;

  if (!resposta) {
    throw new Error('As credenciais não foram preparadas.');
  }

  validarFilmeInvalido(corpoResposta, resposta.status());
});

When(
  'envio uma requisição GET para o endpoint de filmes com paginação inválida',
  async ({ moviesClient, contextoAutenticacao, contextoMovies }) => {
    const tokenAcesso = contextoAutenticacao.tokenAcesso;

    if (!tokenAcesso) {
      throw new Error('O token de acesso não foi preparado.');
    }

    contextoMovies.resposta = await moviesClient.listagemPaginacaoInvalida(tokenAcesso);
  },
);

Then('a API deve retornar status 400 com o erro de validação da paginação', async ({ contextoMovies }) => {
  const resposta = contextoMovies.resposta;
  const corpoResposta = contextoMovies.corpoResposta;

  if (!resposta) {
    throw new Error('As credenciais não foram preparadas.');
  }

  validarPaginacaoInvalida(corpoResposta, resposta.status());
});
