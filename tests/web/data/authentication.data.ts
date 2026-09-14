export type Credenciais = {
  email: string;
  senha: string;
};

export const credenciaisValidas: Credenciais = {
  email: 'qa@adminlab.com',
  senha: 'pwd123',
};

export const credenciaisInvalidas: Credenciais = {
  email: 'qa@adminlab.com',
  senha: 'pwd12345',
};
