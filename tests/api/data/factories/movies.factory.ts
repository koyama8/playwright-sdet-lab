import { faker } from '@faker-js/faker';

export type MovieApiTestData = {
  title: string;
  genre: string;
  year: number;
  rating: number;
  favorite: boolean;
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
