import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { firstValueFrom, type Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';
import type { Movie, MovieInput, Person, PersonInput } from './models';

interface ApiResponse<T> {
  data: T;
}

interface PaginatedResponse<T> {
  items: T[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

interface ApiMovie extends Omit<Movie, 'rating'> {
  rating: number | string;
}

@Injectable({ providedIn: 'root' })
export class LabDataService {
  readonly people = signal<Person[]>([]);
  readonly movies = signal<Movie[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly activePeople = computed(
    () => this.people().filter((item) => item.status === 'ACTIVE').length,
  );

  constructor(private readonly http: HttpClient) {}

  async refresh(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const [peopleResponse, moviesResponse] = await Promise.all([
        firstValueFrom(
          this.http.get<ApiResponse<PaginatedResponse<Person>>>(`${API_BASE_URL}/people`, {
            params: { pageSize: 100 },
          }),
        ),
        firstValueFrom(
          this.http.get<ApiResponse<PaginatedResponse<ApiMovie>>>(`${API_BASE_URL}/movies`, {
            params: { pageSize: 100 },
          }),
        ),
      ]);
      this.people.set(peopleResponse.data.items);
      this.movies.set(moviesResponse.data.items.map((movie) => this.mapMovie(movie)));
    } catch (error) {
      this.handleError(error, 'Não foi possível carregar os dados da API.');
    } finally {
      this.loading.set(false);
    }
  }

  async createPerson(input: PersonInput): Promise<Person> {
    const response = await this.request(
      this.http.post<ApiResponse<Person>>(`${API_BASE_URL}/people`, input),
      'Não foi possível cadastrar a pessoa.',
    );
    this.people.update((items) => [response.data, ...items]);
    return response.data;
  }

  async updatePerson(id: string, input: PersonInput): Promise<Person> {
    const response = await this.request(
      this.http.patch<ApiResponse<Person>>(`${API_BASE_URL}/people/${id}`, input),
      'Não foi possível atualizar a pessoa.',
    );
    this.people.update((items) => items.map((item) => (item.id === id ? response.data : item)));
    return response.data;
  }

  async deletePerson(id: string): Promise<void> {
    await this.request(
      this.http.delete<void>(`${API_BASE_URL}/people/${id}`),
      'Não foi possível excluir a pessoa.',
    );
    this.people.update((items) => items.filter((item) => item.id !== id));
  }

  async createMovie(input: MovieInput, image?: File): Promise<Movie> {
    const response = await this.request(
      this.http.post<ApiResponse<ApiMovie>>(`${API_BASE_URL}/movies`, this.movieBody(input, image)),
      'Não foi possível cadastrar o filme.',
    );
    const movie = this.mapMovie(response.data);
    this.movies.update((items) => [movie, ...items]);
    return movie;
  }

  async updateMovie(id: string, input: MovieInput, image?: File): Promise<Movie> {
    const response = await this.request(
      this.http.patch<ApiResponse<ApiMovie>>(
        `${API_BASE_URL}/movies/${id}`,
        this.movieBody(input, image),
      ),
      'Não foi possível atualizar o filme.',
    );
    const movie = this.mapMovie(response.data);
    this.movies.update((items) => items.map((item) => (item.id === id ? movie : item)));
    return movie;
  }

  async deleteMovie(id: string): Promise<void> {
    await this.request(
      this.http.delete<void>(`${API_BASE_URL}/movies/${id}`),
      'Não foi possível excluir o filme.',
    );
    this.movies.update((items) => items.filter((item) => item.id !== id));
  }

  async toggleFavorite(id: string): Promise<Movie> {
    const response = await this.request(
      this.http.post<ApiResponse<ApiMovie>>(`${API_BASE_URL}/movies/${id}/favorite`, {}),
      'Não foi possível alterar o favorito.',
    );
    const movie = this.mapMovie(response.data);
    this.movies.update((items) => items.map((item) => (item.id === id ? movie : item)));
    return movie;
  }

  async reset(): Promise<void> {
    await this.request(
      this.http.post<ApiResponse<{ people: number; movies: number }>>(
        `${API_BASE_URL}/test-support/reset`,
        {},
      ),
      'Não foi possível restaurar as massas de demonstração.',
    );
    await this.refresh();
  }

  private movieBody(input: MovieInput, image?: File): MovieInput | FormData {
    if (!image) return input;
    const form = new FormData();
    form.set('title', input.title);
    form.set('genre', input.genre);
    form.set('year', String(input.year));
    form.set('rating', String(input.rating));
    form.set('favorite', String(input.favorite));
    form.set('synopsis', input.synopsis);
    form.set('image', image);
    return form;
  }

  private mapMovie(movie: ApiMovie): Movie {
    return { ...movie, rating: Number(movie.rating) };
  }

  private async request<T>(observable: Observable<T>, fallback: string): Promise<T> {
    this.error.set('');
    try {
      return await firstValueFrom(observable);
    } catch (error) {
      throw new Error(this.handleError(error, fallback));
    }
  }

  private handleError(error: unknown, fallback: string): string {
    const message =
      error instanceof HttpErrorResponse && typeof error.error?.error?.message === 'string'
        ? error.error.error.message
        : fallback;
    this.error.set(message);
    return message;
  }
}
