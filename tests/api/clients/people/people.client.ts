import { type APIResponse } from '@playwright/test';
import { ApiClient } from '../api.client';
import { type PersonApiTestData, PersonUpdateApiTestData } from '../../data/factories/people/people.factory';

export class PeopleClient {
  constructor(readonly apiClient: ApiClient) {}

  async listarPessoas(tokenAcesso: string): Promise<APIResponse> {
    return this.apiClient.fetch('/api/people?page=1&pageSize=20', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenAcesso}`,
      },
    });
  }

  async cadastrarPessoa(tokenAcesso: string, pessoa: PersonApiTestData): Promise<APIResponse> {
    return this.apiClient.fetch('/api/people', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenAcesso}`,
      },
      data: pessoa,
    });
  }

  async buscarPessoa(tokenAcesso: string, personId: string): Promise<APIResponse> {
    return this.apiClient.fetch(`/api/people/${personId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenAcesso}`,
      },
    });
  }

  async atualizaPessoa(tokenAcesso: string, personId: string, pessoa: PersonUpdateApiTestData): Promise<APIResponse> {
    return this.apiClient.fetch(`/api/people/${personId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${tokenAcesso}`,
      },
      data: pessoa,
    });
  }

  async filtrarPessoas(tokenAcesso: string): Promise<APIResponse> {
    return this.apiClient.fetch('/api/people?status=ACTIVE&q=Playwright&page=1&pageSize=10', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenAcesso}`,
      },
    });
  }

  async deletarPessoa(tokenAcesso: string, personId: string): Promise<APIResponse> {
    return this.apiClient.fetch(`/api/people/${personId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenAcesso}`,
      },
    });
  }
}
