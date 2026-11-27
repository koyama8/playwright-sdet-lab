import { expect, type Page } from '@playwright/test';
import { type MovieTestData } from '../data/factories/movies.factory';

export class MoviesPage {
  constructor(readonly page: Page) {}

  private filmeEmEdicao?: { testId: string; tituloOriginal: string };

  private cartaoDoFilme(titulo: string) {
    return this.page.getByRole('article').filter({
      has: this.page.getByRole('heading', { name: titulo, exact: true }),
    });
  }

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

  async validarTituloFilme(titulo: string): Promise<void> {
    await expect(this.cartaoDoFilme(titulo)).toBeVisible();
  }

  async clicarEditarFilme(titulo: string): Promise<void> {
    const cartao = this.cartaoDoFilme(titulo);
    const testId = await cartao.getAttribute('data-testid');
    if (!testId) throw new Error('Cartão do filme sem identificador.');

    this.filmeEmEdicao = { testId, tituloOriginal: titulo };
    await cartao.getByRole('button', { name: 'Editar', exact: true }).click();
  }

  async editarTitulo(titulo: string): Promise<void> {
    await this.page.getByTestId('movie-title').fill(titulo);
  }

  async recarregarCatalogo(): Promise<void> {
    await expect(this.page.getByTestId('movie-dialog')).toBeHidden();
    await this.page.reload();
  }

  async restaurarTituloOriginal(): Promise<void> {
    if (!this.filmeEmEdicao) return;
    const { testId, tituloOriginal } = this.filmeEmEdicao;
    await this.acessarPaginaFilmes();
    const cartao = this.page.getByTestId(testId);
    const tituloAtual = await cartao.getByRole('heading').innerText();
    if (tituloAtual === tituloOriginal) return;
    await cartao.getByRole('button', { name: 'Editar', exact: true }).click();
    await this.editarTitulo(tituloOriginal);
    await this.salvarFilme();
    await expect(cartao.getByRole('heading')).toHaveText(tituloOriginal);
  }
}
