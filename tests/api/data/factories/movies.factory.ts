import { faker } from '@faker-js/faker';

export type MovieApiTestData = {
  title: string;
  genre: string;
  year: number;
  rating: number;
  favorite: boolean;
  synopsis: string;
};

export type MovieUpdateApiTestData = {
  title: string;
  rating: number;
  synopsis: string;
};

export function createValidMovieApiData(): MovieApiTestData {
  return {
    title: `Filme API E2E ${faker.string.uuid()}`,
    genre: 'Drama',
    year: faker.number.int({ min: 1888, max: 2026 }),
    rating: faker.number.float({ min: 0, max: 10, fractionDigits: 1 }),
    favorite: false,
    synopsis: `${faker.lorem.words({ min: 8, max: 14 })}.`,
  };
}

export function createFavoriteMovieApiData(): MovieApiTestData {
  return {
    ...createValidMovieApiData(),
    favorite: true,
  };
}

export function createInvalidMovieApiData(): MovieApiTestData {
  return {
    title: 'X',
    genre: 'D',
    year: 1700,
    rating: 15,
    favorite: false,
    synopsis: 'curta',
  };
}

export function createValidMovieUpdateApiData(): MovieUpdateApiTestData {
  return {
    title: `Filme Atualizado E2E ${faker.string.uuid()}`,
    rating: faker.number.float({ min: 0, max: 10, fractionDigits: 1 }),
    synopsis: `${faker.lorem.words({ min: 8, max: 14 })}.`,
  };
}
