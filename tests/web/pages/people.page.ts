import { expect, type Page } from '@playwright/test';

export class PeoplePage {
  constructor(readonly page: Page) {}

  async acessarPaginaPessoas(): Promise<void> {
    await this.page.goto('/pessoas');
  }

  async validarPrimeiraPessoaVisivel(): Promise<void> {
    const pessoa = this.page.locator('[data-testid^="person-row-"]').filter({ hasText: 'Elisa Rocha' });

    await expect(pessoa).toBeVisible();

    await expect(pessoa).toContainText('Elisa Rocha');
    await expect(pessoa).toContainText('UX Designer');
    await expect(pessoa).toContainText('(51) 99995-1005');
    await expect(pessoa).toContainText('Ativo');

    await expect(pessoa.getByRole('button', { name: 'Editar Elisa Rocha' })).toBeVisible();
    await expect(pessoa.getByRole('button', { name: 'Excluir Elisa Rocha' })).toBeVisible();
  }

  async buscarPessoa(nomePessoa: string): Promise<void> {
    const campoBusca = this.page.getByTestId('people-search');

    await campoBusca.fill(nomePessoa);
  }

  async validarResultadoBusca(nomePessoa: string): Promise<void> {
    const pessoa = this.page.locator('[data-testid^="person-row-"]');

    await expect(pessoa).toHaveCount(1);
    await expect(pessoa).toContainText(nomePessoa);
  }
}
