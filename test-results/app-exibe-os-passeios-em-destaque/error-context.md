# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.js >> exibe os passeios em destaque
- Location: tests\e2e\app.spec.js:19:1

# Error details

```
Test timeout of 60000ms exceeded while running "beforeEach" hook.
```

```
TimeoutError: page.waitForResponse: Timeout 60000ms exceeded while waiting for event "response"
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - link "vivaamazônia" [ref=e5] [cursor=pointer]:
      - /url: "#"
    - navigation [ref=e11]:
      - link "Explorar passeios" [ref=e12] [cursor=pointer]:
        - /url: "#passeios"
      - link "Destinos" [ref=e13] [cursor=pointer]:
        - /url: "#destinos"
    - generic [ref=e14]:
      - button "Carrinho" [ref=e15] [cursor=pointer]
      - button "Entrar" [ref=e20] [cursor=pointer]
  - main [ref=e21]:
    - generic [ref=e22]:
      - generic [ref=e24]:
        - generic [ref=e25]: DESCUBRA O AMAZONAS
        - heading [level=1] [ref=e27]:
          - text: O extraordinárioestá
          - emphasis [ref=e28]: mais perto.
        - paragraph [ref=e29]: Encontre experiências únicas, explore paisagens incríveis e viva a Amazônia do seu jeito.
        - link "Encontrar meu passeio" [ref=e30] [cursor=pointer]:
          - /url: "#passeios"
        - generic [ref=e33]:
          - generic [ref=e34]: Rios e águas
          - generic [ref=e39]: Floresta viva
          - generic [ref=e42]: Cultura local
      - generic [ref=e46]: AMAZONAS, BRASIL · 03°S 60°W
    - generic [ref=e47]:
      - generic [ref=e48]:
        - generic [ref=e49]: SUA PRÓXIMA HISTÓRIA COMEÇA AQUI
        - heading [level=2] [ref=e50]:
          - text: Mais que um destino.
          - emphasis [ref=e51]: Uma experiência.
      - paragraph [ref=e52]: Dos rios que se encontram às cachoeiras escondidas na floresta, reunimos experiências autênticas para você descobrir o melhor do Amazonas.
    - generic [ref=e53]:
      - generic [ref=e54]:
        - generic [ref=e55]:
          - generic [ref=e56]: ESCOLHA SUA AVENTURA
          - heading "Passeios em destaque." [level=2] [ref=e57]
        - textbox "O que você quer conhecer?" [ref=e62]
      - generic [ref=e63]:
        - button "Todos os destinos" [ref=e64] [cursor=pointer]
        - button "Manaus" [ref=e65] [cursor=pointer]
        - button "Presidente Figueiredo" [ref=e66] [cursor=pointer]
      - generic [ref=e67]: Nenhum passeio encontrado com esses filtros.
    - generic [ref=e68]:
      - generic [ref=e69]:
        - generic [ref=e70]: A AMAZÔNIA TE ESPERA
        - heading [level=2] [ref=e71]:
          - text: Seu próximo capítulo
          - emphasis [ref=e72]: é por aqui.
      - link "Explorar experiências" [ref=e73] [cursor=pointer]:
        - /url: "#passeios"
  - contentinfo [ref=e76]:
    - link "vivaamazônia" [ref=e77] [cursor=pointer]:
      - /url: "#"
    - generic [ref=e83]: Feito para descobrir. Feito no Amazonas. © 2026
    - link "Documentação da API" [ref=e84] [cursor=pointer]:
      - /url: /api-docs
  - generic [ref=e85] [cursor=pointer]: Não foi possível conectar à API.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.beforeEach(async ({ page }) => {
> 4  |   const toursResponse = page.waitForResponse(
     |                              ^ TimeoutError: page.waitForResponse: Timeout 60000ms exceeded while waiting for event "response"
  5  |     response => response.url().includes('/api/tours') && response.ok(),
  6  |     { timeout: 60_000 }
  7  |   );
  8  |   await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60_000 });
  9  |   await toursResponse;
  10 |   await page.evaluate(() => localStorage.clear());
  11 |   const reloadToursResponse = page.waitForResponse(
  12 |     response => response.url().includes('/api/tours') && response.ok(),
  13 |     { timeout: 60_000 }
  14 |   );
  15 |   await page.reload({ waitUntil: 'domcontentloaded', timeout: 60_000 });
  16 |   await reloadToursResponse;
  17 | });
  18 | 
  19 | test('exibe os passeios em destaque', async ({ page }) => {
  20 |   await expect(page.getByRole('heading', { name: 'Passeios em destaque.' })).toBeVisible();
  21 |   await expect(page.locator('.tour-card')).toHaveCount(4);
  22 | });
  23 | 
  24 | test('filtra passeios por texto', async ({ page }) => {
  25 |   await page.getByPlaceholder('O que você quer conhecer?').fill('Cachoeira');
  26 | 
  27 |   await expect(page.locator('.tour-card')).toHaveCount(1);
  28 |   await expect(page.getByRole('heading', { name: 'Cachoeira de Iracema' })).toBeVisible();
  29 | });
  30 | 
  31 | test('filtra passeios por cidade', async ({ page }) => {
  32 |   await page.getByRole('button', { name: 'Presidente Figueiredo' }).click();
  33 | 
  34 |   await expect(page.locator('.tour-card')).toHaveCount(2);
  35 |   await expect(page.locator('.tour-card').first()).toContainText('Presidente Figueiredo');
  36 | });
  37 | 
  38 | test('rejeita login com senha incorreta', async ({ page }) => {
  39 |   await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  40 |   await page.getByPlaceholder('voce@email.com').fill('ana@exemplo.com');
  41 |   await page.getByPlaceholder('Mínimo 6 caracteres').fill('senha-incorreta');
  42 |   await page.getByRole('button', { name: 'Entrar', exact: true }).last().click();
  43 | 
  44 |   await expect(page.getByText('E-mail ou senha inválidos.')).toBeVisible();
  45 | });
  46 | 
  47 | test('autentica usuário existente', async ({ page }) => {
  48 |   await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  49 |   await page.getByPlaceholder('voce@email.com').fill('ana@exemplo.com');
  50 |   await page.getByPlaceholder('Mínimo 6 caracteres').fill('turismo123');
  51 |   await page.getByRole('button', { name: 'Entrar', exact: true }).last().click();
  52 | 
  53 |   await expect(page.getByRole('button', { name: /Ana · Sair/ })).toBeVisible();
  54 | });
  55 | 
  56 | test('adiciona passeio ao carrinho e altera a quantidade', async ({ page }) => {
  57 |   const card = page.locator('.tour-card').filter({ hasText: 'Cachoeira de Iracema' });
  58 |   await card.getByRole('button', { name: /Reservar/ }).click();
  59 |   await page.getByRole('button', { name: /Carrinho/ }).click();
  60 | 
  61 |   await expect(page.getByRole('heading', { name: 'Seu carrinho.' })).toBeVisible();
  62 |   await expect(page.locator('.cart-detail').getByText('Cachoeira de Iracema')).toBeVisible();
  63 | 
  64 |   await page.getByRole('button').filter({ has: page.locator('svg.lucide-plus') }).click();
  65 |   await expect(page.locator('.qty b')).toHaveText('2');
  66 | });
  67 | 
  68 | test('finaliza uma reserva autenticada', async ({ page }) => {
  69 |   await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  70 |   await page.getByPlaceholder('voce@email.com').fill('ana@exemplo.com');
  71 |   await page.getByPlaceholder('Mínimo 6 caracteres').fill('turismo123');
  72 |   await page.getByRole('button', { name: 'Entrar', exact: true }).last().click();
  73 | 
  74 |   const card = page.locator('.tour-card').filter({ hasText: 'Cachoeira de Iracema' });
  75 |   await card.getByRole('button', { name: /Reservar/ }).click();
  76 |   await page.getByRole('button', { name: /Carrinho/ }).click();
  77 |   await page.getByRole('button', { name: /Finalizar reserva/ }).click();
  78 | 
  79 |   await expect(page.getByRole('heading', { name: 'Reserva confirmada.' })).toBeVisible();
  80 | });
  81 | 
```