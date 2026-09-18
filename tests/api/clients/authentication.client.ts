import { type APIResponse } from '@playwright/test';
import { type CredenciaisAutenticacao } from '../data/payloads/authentication.payload';
import { ApiClient } from './api.client';

export class AuthenticationClient {
  constructor(readonly apiClient: ApiClient) {}

  async realizarLogin(credenciais: CredenciaisAutenticacao): Promise<APIResponse> {
    return this.apiClient.fetch('/api/auth/login', {
      method: 'POST',
      data: credenciais,
    });
  }

  async usuarioAuthenticado(tokenAcesso: string): Promise<APIResponse> {
    return this.apiClient.fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenAcesso}`,
      },
    });
  }
}
