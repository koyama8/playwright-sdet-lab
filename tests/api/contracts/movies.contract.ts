import { expect } from '@playwright/test';
import { type MovieApiTestData } from '../data/factories/movies.factory';

export function validarListagemFilmes(status: number): void {
  expect(status).toBe(200);
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
