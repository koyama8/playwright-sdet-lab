import { expect } from '@playwright/test';

export function validarRestauracaoMassas(corpoResposta: unknown, status: number): void {
  expect(status).toBe(200);

  expect(corpoResposta).toMatchObject({
    data: {
      people: 5,
      movies: 8,
      resetAt: expect.stringMatching(/\S+/),
    },
  });
}
