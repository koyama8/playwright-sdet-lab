import { expect, test } from '@playwright/test';

test('deve autenticar com credenciais válidas', async ({ page }) => {
  await page.goto('/login');

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Acesse sua conta' })).toBeVisible();

  await page.getByLabel('E-mail', { exact: true }).fill('qa@adminlab.com');
  await page.getByLabel('Senha', { exact: true }).fill('pwd123');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Bem-vindo, QA Admin' })).toBeVisible();
});
