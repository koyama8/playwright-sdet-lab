import { faker } from '@faker-js/faker';

export type PersonApiTestData = {
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
};

export type PersonUpdateApiTestData = {
  name: string;
  role: string;
};

export function createValidPersonApiData(): PersonApiTestData {
  return {
    name: `Pessoa API E2E ${faker.string.uuid()}`,
    email: `pessoa.playwright.${faker.string.uuid()}@example.test`,
    phone: '+55 11 99999-0000',
    role: 'QA Automation Engineer',
    status: 'ACTIVE',
  };
}

export function createValidPersonUpdateApiData(): PersonUpdateApiTestData {
  return {
    name: `Pessoa Atualizada E2E ${faker.string.uuid()}`,
    role: 'SDET',
  };
}
