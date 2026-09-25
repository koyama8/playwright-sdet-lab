import { APIResponse } from '@playwright/test';
import { type MovieApiTestData } from '../data/factories/movies.factory';
import { ApiClient } from './api.client';

export class MoviesClient {
  constructor(readonly apiClient: ApiClient) {}

  async listarFilme(tokenAcesso: string): Promise<APIResponse> {
    return this.apiClient.fetch('/api/movies?page=1&pageSize=20', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenAcesso}`,
      },
    });
  }

  async cadastrarFilme(tokenAcesso: string, filme: MovieApiTestData): Promise<APIResponse> {
    return this.apiClient.fetch('/api/movies', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenAcesso}`,
      },
      data: filme,
    });
  }
}
