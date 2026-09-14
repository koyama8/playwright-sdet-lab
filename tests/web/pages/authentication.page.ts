import { expect, type Page } from '@playwright/test';

export class AuthenticationPage {
  constructor(readonly page: Page) {}

  async acessarPaginaLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  async preencherCredenciais(email: string, password: string): Promise<void> {
    await this.page.getByTestId('login-email').fill(email);
    await this.page.getByTestId('login-password').fill(password);
  }

  async clicarBotaoEntrar(): Promise<void> {
    await this.page.getByRole('button', { name: 'Entrar', exact: true }).click();
  }

  async validarLoginComSucesso(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard$/);
    await expect(
      this.page.getByRole('heading', { name: 'Bem-vindo, QA Admin', exact: true }),
    ).toBeVisible();
  }

  async validarCredenciaisInvalidas(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login$/);
    await expect(
      this.page.getByText('E-mail ou senha inválidos.', { exact: true }),
    ).toBeVisible();
  }

  async autenticarUsuario(email: string, password: string): Promise<void> {
    await this.page.clock.install();
    await this.acessarPaginaLogin();
    await this.preencherCredenciais(email, password);
    await this.clicarBotaoEntrar();
    await expect(this.page).toHaveURL(/\/dashboard$/);
  }

  async simularPeriodoInativo(): Promise<void> {
    await this.page.clock.fastForward('09:59');
  }

  async atingirTempoLimiteSessao(): Promise<void> {
    await this.page.clock.fastForward('00:01');
  }

  async validarSessaoExpirada(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login\?reason=session-expired$/);
    await expect(
      this.page.getByText('Você ficou 10 minutos sem atividade. Entre novamente.', {
        exact: true,
      }),
    ).toBeVisible();
  }
}
