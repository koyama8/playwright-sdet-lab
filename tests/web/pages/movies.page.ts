import { expect, type Page } from '@playwright/test';
import { type MovieTestData } from '../data/factories/movies.factory';

export class MoviesPage {
  constructor(readonly page: Page) {}

  async acessarPaginaFilmes(): Promise<void> {
    await this.page.goto('/filmes');
  }

  async validarPrimeiroFilmeVisivel(): Promise<void> {
    const filmeVingadores = this.page.locator('[data-testid^="movie-card-"]').filter({ hasText: 'Vingadores: Ultimato' });

    await expect(filmeVingadores).toBeVisible();
    await expect(filmeVingadores).toContainText('2019 · Ação');
    await expect(filmeVingadores).toContainText('Heróis se unem para restaurar o universo.');
  }

  async clicarVerFilme(): Promise<void> {
    await this.page.getByRole('button', { name: '＋ Novo filme' }).click();
  }

  async preencherDadosDoFilme(filme: MovieTestData): Promise<void> {
    await this.page.getByTestId('movie-title').fill(filme.title);

    await this.page.getByTestId('movie-genre').selectOption(filme.genre);

    await this.page.getByTestId('movie-year').fill(filme.year);

    await this.page.getByTestId('movie-rating').fill(filme.rating);

    await this.page.getByTestId('movie-synopsis').fill(filme.synopsis);
  }

  async salvarFilme(): Promise<void> {
    await this.page.getByRole('button', { name: 'Salvar filme' }).click();
  }

  async validarFilmeCadastrado(titulo: string): Promise<void> {
    const filmeCadastrado = this.page.locator('[data-testid^="movie-card-"]').filter({ hasText: titulo });

    await expect(filmeCadastrado).toBeVisible();
  }

  async validarTituloFilme(): Promise<void> {
    const filmeCadastrado = this.page.locator('[data-testid^="movie-card-"]').filter({ hasText: 'Interestelar' });

    await expect(filmeCadastrado).toBeVisible();
  }

  async clicarEditarFilme(): Promise<void> {
    await this.page.locator('[data-testid="edit-movie-e2e4fc6d-eec9-4650-99e9-1d69f181c7b3"]').click();
  }

  async editarFilme(): Promise<void> {
    await this.page.getByTestId('movie-title').fill('Interestelar - Edição Especial');
  }

  async salvarFilmeEditado(): Promise<void> {
    await this.page.getByRole('button', { name: ' Salvar filme ' }).click();
  }

  async visualizarFilme(): Promise<void> {
    const filmeAtualizado = this.page
      .locator('[data-testid="movie-card-e2e4fc6d-eec9-4650-99e9-1d69f181c7b3"]')
      .filter({ hasText: 'Interestelar - Edição Especial' });

    await expect(filmeAtualizado).toBeVisible();
  }
}
