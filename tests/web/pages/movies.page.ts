import { expect, type Page } from '@playwright/test';
import { type MovieTestData } from '../data/factories/movies.factory';

export class MoviesPage {
  constructor(readonly page: Page) {}

  async acessarPaginaFilmes(): Promise<void> {
    await this.page.goto('/filmes');
  }

  async validarPrimeiroFilmeVisivel(): Promise<void> {
    const primeiroFilme = this.page.locator('[data-testid^="movie-card-"]').first();

    await expect(primeiroFilme).toBeVisible();
    await expect(primeiroFilme).toContainText('Vingadores: Ultimato');
    await expect(primeiroFilme).toContainText('2019 · Ação');
    await expect(primeiroFilme).toContainText('Heróis se unem para restaurar o universo.');
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
}
