import { APIResponse } from '@playwright/test';
import { type MovieApiTestData, type MovieUpdateApiTestData } from '../data/factories/movies.factory';
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

  async buscarFilme(tokenAcesso: string, filmeId: string): Promise<APIResponse> {
    return this.apiClient.fetch(`/api/movies/${filmeId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenAcesso}`,
      },
    });
  }

  async atualizarFilme(tokenAcesso: string, filmeId: string, dadosAtualizacao: MovieUpdateApiTestData): Promise<APIResponse> {
    return this.apiClient.fetch(`/api/movies/${filmeId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${tokenAcesso}`,
      },
      data: dadosAtualizacao,
    });
  }

  async excluirFilme(tokenAcesso: string, movieId: string): Promise<APIResponse> {
    return this.apiClient.fetch(`/api/movies/${movieId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenAcesso}`,
      },
    });
  }

  async listarFavoritos(tokenAcesso: string): Promise<APIResponse> {
    return this.apiClient.fetch('/api/movies?favorite=true&page=1&pageSize=20', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenAcesso}`,
      },
    });
  }

  async rejeitarFilme(tokenAcesso: string, filme: MovieApiTestData): Promise<APIResponse> {
    return this.apiClient.fetch('/api/movies', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenAcesso}`,
      },
      data: filme,
    });
  }

  async listagemPaginacaoInvalida(tokenAcesso: string): Promise<APIResponse> {
    return this.apiClient.fetch('/api/movies?page=0&pageSize=500', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenAcesso}`,
      },
    });
  }
}
