import { expect } from '@playwright/test';
import { type MovieApiTestData, type MovieUpdateApiTestData } from '../data/factories/movies.factory';

export function validarListagemFilmes(status: number): void {
  expect(status).toBe(200);
}

export function validarBuscarFilme(status: number): void {
  expect(status).toBe(200);
}

export function validarAtualizacaoFilme(corpoResposta: unknown, status: number, dadosEsperados: MovieUpdateApiTestData): void {
  expect(status).toBe(200);

  expect(corpoResposta).toMatchObject({
    data: {
      id: expect.stringMatching(/\S+/),
      title: dadosEsperados.title,
      rating: String(dadosEsperados.rating),
      synopsis: dadosEsperados.synopsis,
      updatedAt: expect.stringMatching(/\S+/),
    },
  });
}

export function validarCadastroFilme(corpoResposta: unknown, status: number, filmeEsperado: MovieApiTestData): void {
  expect(status).toBe(201);

  expect(corpoResposta).toMatchObject({
    data: {
      id: expect.stringMatching(/\S+/),
      title: filmeEsperado.title,
      genre: filmeEsperado.genre,
      year: filmeEsperado.year,
      rating: String(filmeEsperado.rating),
      favorite: filmeEsperado.favorite,
      synopsis: filmeEsperado.synopsis,
      createdById: expect.stringMatching(/\S+/),
      createdAt: expect.stringMatching(/\S+/),
      updatedAt: expect.stringMatching(/\S+/),
    },
  });
}

export function validarDeletarFilme(corpoResposta: unknown, status: number): void {
  expect(status).toBe(200);

  expect(corpoResposta).toMatchObject({
    message: 'Filme excluído com sucesso.',
  });
}

export function validarListagemFavoritos(status: number): void {
  expect(status).toBe(200);
}

export function validarFilmeInvalido(corpoResposta: unknown, status: number): void {
  expect(status).toBe(400);

  expect(corpoResposta).toMatchObject({
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Invalid request',
    },
  });
}

export function validarPaginacaoInvalida(corpoResposta: unknown, status: number): void {
  expect(status).toBe(400);

  expect(corpoResposta).toMatchObject({
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Invalid request',
      details: expect.arrayContaining([
        expect.objectContaining({
          code: 'too_small',
          path: ['page'],
        }),
        expect.objectContaining({
          code: 'too_big',
          path: ['pageSize'],
        }),
      ]),
      requestId: expect.any(String),
    },
  });
}
