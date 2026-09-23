import { faker } from '@faker-js/faker';

export type MovieTestData = {
  title: string;
  genre: string;
  year: string;
  rating: string;
  synopsis: string;
};

export function createValidMovieData(): MovieTestData {
  return {
    title: `Filme E2E ${faker.string.uuid()}`,
    genre: 'Drama',
    year: '2024',
    rating: '8.0',
    synopsis: faker.lorem.sentence(),
  };
}
