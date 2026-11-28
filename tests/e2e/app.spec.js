import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60_000 });
});

test('exibe os passeios em destaque', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Passeios em destaque.' })).toBeVisible();
  await expect(page.locator('.tour-card')).toHaveCount(4);
});

test('filtra passeios por texto', async ({ page }) => {
  await page.getByPlaceholder('O que você quer conhecer?').fill('Cachoeira');

  await expect(page.locator('.tour-card')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Cachoeira de Iracema' })).toBeVisible();
});

test('filtra passeios por cidade', async ({ page }) => {
  await page.getByRole('button', { name: 'Presidente Figueiredo' }).click();

  await expect(page.locator('.tour-card')).toHaveCount(2);
  await expect(page.locator('.tour-card').first()).toContainText('Presidente Figueiredo');
});

test('rejeita login com senha incorreta', async ({ page }) => {
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await page.getByPlaceholder('voce@email.com').fill('ana@exemplo.com');
  await page.getByPlaceholder('Mínimo 6 caracteres').fill('senha-incorreta');
  await page.getByRole('button', { name: 'Entrar', exact: true }).last().click();

  await expect(page.getByText('E-mail ou senha inválidos.')).toBeVisible();
});

test('autentica usuário existente', async ({ page }) => {
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await page.getByPlaceholder('voce@email.com').fill('ana@exemplo.com');
  await page.getByPlaceholder('Mínimo 6 caracteres').fill('turismo123');
  await page.getByRole('button', { name: 'Entrar', exact: true }).last().click();

  await expect(page.getByRole('button', { name: /Ana · Sair/ })).toBeVisible();
});

test('adiciona passeio ao carrinho e altera a quantidade', async ({ page }) => {
  const card = page.locator('.tour-card').filter({ hasText: 'Cachoeira de Iracema' });
  await card.getByRole('button', { name: /Reservar/ }).click();
  await page.getByRole('button', { name: /Carrinho/ }).click();

  await expect(page.getByRole('heading', { name: 'Seu carrinho.' })).toBeVisible();
  await expect(page.locator('.cart-detail').getByText('Cachoeira de Iracema')).toBeVisible();

  await page.getByRole('button').filter({ has: page.locator('svg.lucide-plus') }).click();
  await expect(page.locator('.qty b')).toHaveText('2');
});

test('finaliza uma reserva autenticada', async ({ page }) => {
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await page.getByPlaceholder('voce@email.com').fill('ana@exemplo.com');
  await page.getByPlaceholder('Mínimo 6 caracteres').fill('turismo123');
  await page.getByRole('button', { name: 'Entrar', exact: true }).last().click();

  const card = page.locator('.tour-card').filter({ hasText: 'Cachoeira de Iracema' });
  await card.getByRole('button', { name: /Reservar/ }).click();
  await page.getByRole('button', { name: /Carrinho/ }).click();
  await page.getByRole('button', { name: /Finalizar reserva/ }).click();

  await expect(page.getByRole('heading', { name: 'Reserva confirmada.' })).toBeVisible();
});
