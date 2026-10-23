import { mkdtemp, rm } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { test, expect, type BrowserContext } from '@playwright/test';

test('chiusura del processo browser e riapertura dello stesso profilo sintetico', async ({ playwright, browserName }, info) => {
  const cache = resolve('.cache');
  const profile = await mkdtemp(resolve(cache, 'reopen-'));
  if (dirname(profile) !== cache || !basename(profile).startsWith('reopen-')) throw new Error('Percorso di pulizia non sicuro.');
  let context: BrowserContext | undefined;
  const errors: string[] = [];
  const external: string[] = [];
  async function launch() {
    context = await playwright[browserName].launchPersistentContext(profile, {
      headless: true,
      viewport: info.project.use.viewport ?? { width: 1440, height: 1000 },
      isMobile: Boolean(info.project.use.isMobile), hasTouch: Boolean(info.project.use.hasTouch),
    });
    const page = context.pages()[0] ?? await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('request', request => { if (new URL(request.url()).origin !== 'http://127.0.0.1:8879') external.push(request.url()); });
    return page;
  }
  try {
    let page = await launch();
    await page.goto('http://127.0.0.1:8879/#/projects/orione');
    await page.getByRole('checkbox', { name: 'Definire il prossimo passo' }).click();
    await expect(page.getByText(/Stato aggiornato. Salvato in questo browser/)).toBeVisible();
    await page.getByRole('textbox', { name: 'Nome del progetto' }).fill('Conservato dopo riapertura');
    await page.getByRole('button', { name: 'Aggiorna nome' }).click();
    await expect(page.getByText(/Nome aggiornato. Salvato in questo browser/)).toBeVisible();
    await context!.close();
    context = undefined;
    page = await launch();
    await page.goto('http://127.0.0.1:8879/#/projects/orione');
    await expect(page.getByRole('heading', { level: 1, name: 'Conservato dopo riapertura' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Definire il prossimo passo' })).toBeChecked();
    await expect(page.getByRole('button', { name: 'Annulla ultima operazione' })).toBeDisabled();
    expect(errors).toEqual([]);
    expect(external).toEqual([]);
  } finally {
    await context?.close();
    // Solo il profilo di test appena creato, mai un profilo personale del browser.
    await rm(profile, { recursive: true, force: true });
  }
});
