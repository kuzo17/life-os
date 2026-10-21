import { test as base, expect, type Page } from '@playwright/test';

const test = base.extend<{ runtimeGuard: void }>({
  runtimeGuard: [async ({ page }, use, info) => {
    const errors: string[] = [];
    const external: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('request', request => {
      if (!['http://127.0.0.1:8879', 'http://127.0.0.1:8880'].includes(new URL(request.url()).origin)) external.push(request.url());
    });
    await use();
    if (info.status !== info.expectedStatus && info.project.use.browserName !== 'webkit') {
      // Screenshotter WebKit inietta "body {}" per sincronizzare animazioni: la CSP lo rifiuta.
      // Non indebolire la build: su WebKit restano trace e controlli funzionali, senza screenshot.
      const body = await page.screenshot({ fullPage: true, caret: 'initial' });
      await info.attach('pagina-al-fallimento', { body, contentType: 'image/png' });
    }
    expect(errors, 'Errori runtime/console nella build').toEqual([]);
    expect(external, 'Nessuna connessione esterna, font remoto o SDK').toEqual([]);
  }, { auto: true }],
});

async function navigate(page: Page, label: string) {
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  if ((page.viewportSize()?.width ?? 1440) <= 760) {
    await menu.click();
    await page.getByRole('dialog', { name: 'Navigazione' }).getByRole('link', { name: label, exact: true }).click();
  } else {
    await page.mouse.move(900, 300);
    await page.getByRole('complementary', { name: 'Barra laterale' }).hover();
    await page.getByRole('link', { name: label, exact: true }).click();
  }
}

test('stesso record tra Oggi, Progetto, Agenda e Undo', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('checkbox', { name: 'Definire il prossimo passo' }).check();
  await page.getByRole('main').getByRole('link', { name: 'Progetto Orione', exact: true }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: 'Progetto Orione' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Definire il prossimo passo' })).toBeChecked();
  await navigate(page, 'Agenda');
  await expect(page.getByRole('heading', { level: 1, name: 'Agenda' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Definire il prossimo passo' })).toBeChecked();
  await page.getByRole('button', { name: 'Annulla ultima operazione' }).click();
  await expect(page.getByRole('checkbox', { name: 'Definire il prossimo passo' })).not.toBeChecked();
});

test('tutte le destinazioni, errori recuperabili e cronologia', async ({ page }) => {
  await page.goto('/#/today');
  for (const [label, heading] of [['Progetti', 'Progetti'], ['FitOS', 'FitOS'], ['Finanze', 'Finanze'], ['Inbox', 'Inbox'], ['Impostazioni', 'Impostazioni'], ['Agenda', 'Agenda'], ['Oggi', 'Oggi']]) {
    await navigate(page, label!);
    await expect(page.getByRole('heading', { level: 1, name: heading!, exact: true })).toBeVisible();
  }
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1, name: 'Agenda' })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('heading', { level: 1, name: 'Oggi' })).toBeVisible();
  await page.goto('/#/projects/mancante');
  await expect(page.getByRole('heading', { name: 'Progetto non trovato' })).toBeVisible();
  await page.getByRole('link', { name: 'Vai ai progetti' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Progetti' })).toBeVisible();
  await page.goto('/#/non-esiste');
  await expect(page.getByRole('heading', { name: 'Pagina non trovata' })).toBeVisible();
});

test('sidebar hover, pin e tastiera oppure dialog mobile con focus', async ({ page }) => {
  // Anche con puntatore iniziale sul bordo, niente reveal prima di un movimento effettivo.
  await page.mouse.move(0, 0);
  await page.goto('/#/today');
  await expect(page.getByRole('heading', { level: 1, name: 'Oggi' })).toBeVisible();
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  if (await menu.isVisible()) {
    await menu.click();
    const dialog = page.getByRole('dialog', { name: 'Navigazione' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Chiudi' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(dialog.getByRole('link', { name: 'Impostazioni' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(dialog.getByRole('button', { name: 'Chiudi' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(menu).toBeFocused();
    await menu.click();
    await dialog.getByRole('link', { name: 'Progetti' }).tap();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Progetti' })).toBeFocused();
    await menu.click();
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('main')).toBeFocused();
  } else {
    const rail = page.getByRole('complementary', { name: 'Barra laterale' });
    await expect(rail).toHaveCSS('width', '80px');
    await expect(rail.getByRole('link', { name: 'Oggi', exact: true }).locator('.nav-text')).toHaveCSS('visibility', 'hidden');
    await rail.hover();
    await expect(rail).toHaveCSS('width', '258px');
    await expect(rail.getByRole('link', { name: 'Oggi', exact: true }).locator('.nav-text')).toHaveCSS('visibility', 'visible');
    await page.mouse.move(800, 300);
    await expect(rail).toHaveCSS('width', '80px');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Salta al contenuto' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Oggi', exact: true })).toBeFocused();
    await expect(rail).toHaveCSS('width', '258px');
    await page.getByRole('button', { name: 'Fissa la navigazione' }).click();
    await expect(page.getByRole('button', { name: 'Sgancia la navigazione' })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('heading', { level: 1, name: 'Oggi' }).focus();
    await page.mouse.move(800, 300);
    await expect(rail).toHaveCSS('width', '258px');
    await page.getByRole('button', { name: 'Sgancia la navigazione' }).click();
    await page.getByRole('heading', { level: 1, name: 'Oggi' }).focus();
    await page.mouse.move(800, 300);
    await expect(rail).toHaveCSS('width', '80px');
  }
});

test('rinomina, conferma, Undo e riferimenti stabili', async ({ page }) => {
  await page.goto('/#/projects/orione');
  await page.getByRole('textbox', { name: 'Nome del progetto' }).fill('Progetto rinominato');
  await page.getByRole('button', { name: 'Aggiorna nome' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Progetto rinominato' })).toBeVisible();
  await expect(page.getByText(/Nome aggiornato solo in memoria/)).toBeVisible();
  await navigate(page, 'Oggi');
  await expect(page.getByRole('main').getByRole('link', { name: 'Progetto rinominato', exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Annulla ultima operazione' }).click();
  await expect(page.getByRole('main').getByRole('link', { name: 'Progetto Orione', exact: true }).first()).toBeVisible();
});

test('reload esplicito: i dati sono ancora volatili', async ({ page }) => {
  await page.goto('/#/today');
  await expect(page.getByText('Dati sintetici · solo memoria')).toBeVisible();
  await page.getByRole('checkbox', { name: 'Definire il prossimo passo' }).check();
  await page.reload();
  await expect(page.getByRole('checkbox', { name: 'Definire il prossimo passo' })).not.toBeChecked();
});

test('deep link della build anche sotto un percorso statico', async ({ page }) => {
  await page.goto('http://127.0.0.1:8880/lifeos-preview/#/projects/orione');
  await expect(page.getByRole('heading', { level: 1, name: 'Progetto Orione' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Definire il prossimo passo' })).toBeVisible();
});

test('temi, larghezza disponibile e schermate della build', async ({ page }, info) => {
  await page.goto('/#/today');
  await expect(page.getByRole('heading', { level: 1, name: 'Oggi' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.getByRole('main')).toHaveCSS('color', 'rgb(243, 247, 251)');
  if (info.project.use.browserName !== 'webkit') await page.screenshot({ path: info.outputPath('today-dark.png'), fullPage: true, caret: 'initial' });
  await page.getByRole('button', { name: 'Attiva tema chiaro' }).click();
  await expect(page.locator('.app')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('main')).toHaveCSS('color', 'rgb(24, 39, 44)');
  if (info.project.use.browserName !== 'webkit') await page.screenshot({ path: info.outputPath('today-light.png'), fullPage: true, caret: 'initial' });
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
