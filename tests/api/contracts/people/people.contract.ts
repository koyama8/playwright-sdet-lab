import { expect } from '@playwright/test';
import { type PersonApiTestData } from '../../data/factories/people/people.factory';

export function validarListagem(status: number): void {
  expect(status).toBe(200);
}

export function validarCadastro(corpoResposta: unknown, status: number, dadosEsperados: PersonApiTestData): void {
  expect(status).toBe(201);

  expect(corpoResposta).toMatchObject({
    data: {
      id: expect.stringMatching(/\S+/),
      name: dadosEsperados.name,
      email: dadosEsperados.email,
      phone: dadosEsperados.phone,
      role: dadosEsperados.role,
      status: dadosEsperados.status,
    },
  });
}
