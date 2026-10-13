export type CredenciaisAutenticacao = {
  email: string;
  password: string;
};

export const credenciaisValidas: CredenciaisAutenticacao = {
  email: 'qa@adminlab.com',
  password: 'pwd123',
};

export const credenciaisInvalidas: CredenciaisAutenticacao = {
  email: 'qa@adminlab.com',
  password: 'pwd12345',
};
