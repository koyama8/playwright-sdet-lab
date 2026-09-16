import { expect } from '@playwright/test';

export function validarLoginComSucesso(corpoResposta: unknown, status: number): void {
  expect(status).toBe(200);

  expect(corpoResposta).toMatchObject({
    data: {
      accessToken: expect.stringMatching(/\S+/),
      refreshToken: expect.stringMatching(/\S+/),
      tokenType: 'Bearer',
      expiresIn: 900,

      session: {
        idleTimeoutSeconds: 600,
        refreshTokenExpiresInDays: 7,
      },

      user: {
        id: expect.stringMatching(/\S+/),
        email: 'qa@adminlab.com',
        name: 'QA Admin',
        role: 'ADMIN',
      },
    },
  });
}
