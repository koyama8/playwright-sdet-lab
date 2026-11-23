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

  async filtrarPessoasPorStatus(status: string): Promise<void> {
    const filtroStatus = this.page.getByTestId('people-status-filter');

    await filtroStatus.selectOption({ label: status });
  }

  async validarPessoasComStatus(status: string): Promise<void> {
    const pessoas = this.page.locator('[data-testid^="person-row-"]');

    await expect(pessoas.first()).toBeVisible();

    const quantidadePessoas = await pessoas.count();

    expect(quantidadePessoas).toBeGreaterThan(0);

    for (let indice = 0; indice < quantidadePessoas; indice++) {
      await expect(pessoas.nth(indice)).toContainText(status);
    }
  }

  async filtrarPessoasPorstatusInativo(status: string): Promise<void> {
    const filtroStatus = this.page.getByTestId('people-status-filter');

    await filtroStatus.selectOption({ label: status });
  }

  async validarPessoasComStatusInativo(status: string): Promise<void> {
    const pessoas = this.page.locator('[data-testid^="person-row-"]');

    await expect(pessoas.first()).toBeVisible();

    const quantidadePessoas = await pessoas.count();

    expect(quantidadePessoas).toBeGreaterThan(0);

    for (let indice = 0; indice < quantidadePessoas; indice++) {
      await expect(pessoas.nth(indice)).toContainText(status);
    }
  }
}
