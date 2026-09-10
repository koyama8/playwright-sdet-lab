export type Status = 'ACTIVE' | 'INACTIVE';

export interface Person {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: Status;
  createdAt: string;
  updatedAt?: string;
}

export type PersonInput = Pick<Person, 'name' | 'email' | 'phone' | 'role' | 'status'>;

export interface Movie {
  id: string;
  title: string;
  imageUrl: string | null;
  genre: string;
  year: number;
  rating: number;
  favorite: boolean;
  synopsis: string;
  createdAt?: string;
  updatedAt?: string;
}

export type MovieInput = Pick<
  Movie,
  'title' | 'genre' | 'year' | 'rating' | 'favorite' | 'synopsis'
>;
