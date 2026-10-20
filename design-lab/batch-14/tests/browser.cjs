const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require(process.env.LIFEOS_PLAYWRIGHT || 'playwright');

(async () => {
  let server;
  if (!process.env.LIFEOS_URL) {
    server = spawn(process.execPath, [path.join(__dirname,'../tools/serve.mjs')], { env: {...process.env,PORT:'8876'}, windowsHide:true });
    await new Promise((resolve,reject)=>{ server.stdout.once('data',resolve); server.once('error',reject); server.once('exit',code=>reject(new Error('Server exited: '+code))); });
  }
  const browser = await chromium.launch({ headless: true, ...(process.env.LIFEOS_BROWSER ? { executablePath: process.env.LIFEOS_BROWSER } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.route('https://fonts.googleapis.com/**',route=>route.abort());
    const base = process.env.LIFEOS_URL || 'http://127.0.0.1:8876/';
    const errors = [], failures = [];
    page.on('pageerror', error => errors.push(String(error)));
    page.on('response', response => { if (response.status() >= 400 && response.url().includes('/src/')) failures.push(response.url()); });
    const routes = ['/today','/projects','/projects/folder/zjpc',
      ...['tasks','goals','recur','expenses','notes'].map(tab=>'/projects/workspace/kdp/'+tab),
      '/agenda/week/2','/agenda/day/0','/fitos/today','/fitos/food','/fitos/stretch','/fitos/weight',
      '/fitos/train/week','/fitos/train/catalog','/fitos/train/history','/fitos/train/history/hist-01','/fitos/train/progression','/fitos/train/session',
      ...Array.from({length:7},(_,index)=>'/fitos/train/day/'+index),
      ...['overview','income','assets','scheduled'].map(tab=>'/finance/'+tab),
      ...['kdp','shop','vinted','cards'].map(source=>'/finance/source/'+source),
      '/collections/cards','/collections/vinted','/inbox','/review','/more','/invalid'];
    for (const [index,route] of routes.entries()) {
      await page.goto(`${base}?smoke=${index}#${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => document.querySelector('#view')?.textContent.length > 40);
      assert.equal(await page.locator('body').getAttribute('data-startup-error'), null, route);
      assert.equal(await page.evaluate(() => typeof globalThis.tasks), 'undefined');
    }
    console.log(`PASS ${routes.length} route loads; no global data bridge`);
    if (process.env.LIFEOS_SMOKE_ONLY) {
      assert.deepEqual(errors, []); assert.deepEqual(failures, []); return;
    }

    await page.goto(base+'#/today');
    await page.waitForSelector('[data-task-leaf="t3"]');
    await page.locator('[data-task-leaf="t3"]').click();
    await page.locator('#leaf-title').fill('Task tecnica sintetica');
    await page.locator('#task-leaf-form button[type="submit"]').click();
    assert.ok((await page.locator('#view').innerText()).includes('Task tecnica sintetica'));
    await page.locator('#core-undo').click();
    assert.ok(!(await page.locator('#view').innerText()).includes('Task tecnica sintetica'));

    await page.locator('#open-quick').click();
    await page.locator('[data-ux="quick-mode"][data-mode="fast"]').click();
    await page.locator('#fast-kind').selectOption('task');
    await page.locator('#fast-title').fill('Task catturata sintetica');
    await page.locator('#fast-project').selectOption('kdp');
    await page.locator('#fast-form button[type="submit"]').click();
    assert.ok((await page.locator('#view').innerText()).includes('Task catturata sintetica'), JSON.stringify({errors,toast:await page.locator('#toast').innerText(),dialog:await page.locator('#dlg').getAttribute('open')}));

    await page.goto(base+'#/projects/workspace/kdp/tasks');
    await page.waitForSelector('[data-task-leaf]');
    assert.ok((await page.locator('#view').innerText()).includes('Task catturata sintetica'));
    await page.goto(base+'#/agenda/week/'+((new Date().getDay()+6)%7));
    await page.waitForSelector('[data-agenda-bulk-toggle]');
    assert.ok((await page.locator('#view').innerText()).includes('Task catturata sintetica'));
    await page.locator('[data-agenda-bulk-toggle]').click();
    await page.locator('[data-agenda-select="t3"]').click();
    await page.locator('[data-agenda-bulk-action="duplicate"]').click();
    assert.ok((await page.locator('#view').innerText()).includes('Preparare il prossimo carosello · copia'));
    await page.locator('#core-undo').click();
    assert.ok(!(await page.locator('#view').innerText()).includes('Preparare il prossimo carosello · copia'));

    await page.goto(base+'#/inbox');
    await page.locator('#inbox-entry').fill('Nota da smistare sintetica');
    await page.locator('[data-action="inbox-add"]').click();
    await page.locator('.list-item').filter({hasText:'Nota da smistare sintetica'}).getByRole('button',{name:'Smista'}).click();
    await page.locator('[data-triage-to="note"]').click();
    await page.locator('#fast-project').selectOption('kdp');
    await page.locator('#fast-form button[type="submit"]').click();
    assert.ok(!(await page.locator('#view').innerText()).includes('Nota da smistare sintetica'));
    await page.goto(base+'#/projects/workspace/kdp/notes');
    await page.waitForFunction(()=>document.querySelector('#view').textContent.includes('Nota da smistare sintetica'));
    await page.locator('#core-undo').click();
    await page.goto(base+'#/inbox');
    await page.waitForFunction(()=>document.querySelector('#view').textContent.includes('Nota da smistare sintetica'));
    console.log('PASS edit/undo, capture → project → Agenda, bulk, string-ID Inbox → note/undo');

    await page.goto(base+'#/projects');
    await page.locator('[data-folder-manage]').click();
    await page.locator('[data-folder-create]').click();
    await page.locator('#folder-name').fill('Cartella QA sintetica');
    await page.locator('#folder-edit-form button[type="submit"]').click();
    assert.ok((await page.locator('#dlg').innerText()).includes('Cartella QA sintetica'));
    await page.locator('#dlg [data-close]').first().click();
    await page.locator('#core-undo').click();
    assert.ok(!(await page.locator('#view').innerText()).includes('Cartella QA sintetica'));
    await page.goto(base+'#/projects/folder/zjpc');
    await page.locator('[data-project-create]').click();
    await page.locator('#project-name').fill('Progetto QA sintetico');
    await page.locator('#project-edit-form button[type="submit"]').click();
    assert.ok((await page.locator('#view').innerText()).includes('Progetto QA sintetico'));
    await page.locator('#core-undo').click();
    // Undo may remove the currently viewed project: the view must recover gracefully.
    assert.equal(await page.locator('body').getAttribute('data-startup-error'), null);

    await page.goto(base+'#/collections/cards');
    await page.locator('[data-inventory-item="card-1"]').click();
    await page.locator('#inventory-name').fill('Carta QA sintetica');
    await page.locator('#inventory-item-form button[type="submit"]').click();
    assert.ok((await page.locator('#view').innerText()).includes('Carta QA sintetica'));
    await page.locator('#core-undo').click();
    assert.ok(!(await page.locator('#view').innerText()).includes('Carta QA sintetica'));
    await page.goto(base+'#/finance/overview');
    await page.locator('[data-action="tx-new"]').first().click();
    await page.locator('#tx-name').fill('Movimento QA sintetico');
    await page.locator('#tx-amount').fill('14');
    await page.locator('#tx-form button[type="submit"]').click();
    await page.locator('#confirm-demo-tx').click();
    assert.ok((await page.locator('#view').innerText()).includes('Movimento QA sintetico'));
    await page.locator('#core-undo').click();
    assert.ok(!(await page.locator('#view').innerText()).includes('Movimento QA sintetico'));
    console.log('PASS folder/project commands, inventory and finance shared Undo');

    await page.goto(base+'#/fitos/train/session');
    await page.locator('[data-session-action="start"]').click();
    await page.locator('[data-session-action="rir-minus"]').click();
    await page.locator('#session-set-note').fill('Nota serie sintetica');
    await page.locator('[data-session-action="complete"]').click();
    assert.equal(await page.locator('#session-rest-display').isVisible(), true);
    await page.locator('[data-session-action="rest-skip"]').click();
    await page.locator('[data-session-action="undo"]').click();
    assert.equal(await page.locator('#session-set-note').inputValue(),'Nota serie sintetica');
    await page.goto(base+'#/fitos/train/progression');
    await page.locator('[data-progression-rule="conservative"]').click();
    await page.locator('[data-progression-deload]').check();
    assert.ok((await page.locator('.history-kpis').innerText()).includes('Attivo'));
    await page.locator('[data-theme="light"]').click();
    assert.equal(await page.locator('body').getAttribute('data-theme'), 'light');
    await page.locator('#open-search').click();
    await page.locator('#command-q').fill('KDP');
    assert.ok((await page.locator('#command-results').innerText()).includes('KDP'));
    await page.keyboard.press('Escape');

    const output = process.env.LIFEOS_QA_DIR;
    if (output) { fs.mkdirSync(output,{recursive:true}); await page.screenshot({path:path.join(output,'batch14-desktop-light.png')}); }
    await page.locator('[data-theme="dark"]').click();
    const rail = page.locator('#primary-sidebar');
    await page.mouse.move(900,300);
    await page.waitForTimeout(300);
    assert.ok((await rail.boundingBox()).width < 100);
    await rail.hover();
    await page.waitForTimeout(300);
    assert.ok((await rail.boundingBox()).width > 200);
    assert.equal(await rail.evaluate(el=>el.scrollLeft),0,'Pinned navigation must not be horizontally scrolled');
    await page.locator('[data-nav-pin]').click();
    await page.mouse.move(900,300);
    await page.waitForTimeout(300);
    assert.ok((await rail.boundingBox()).width > 200);
    assert.equal(await rail.evaluate(el=>el.scrollLeft),0,'Pinned navigation must remain visible after pointer exit');
    if(output)await page.screenshot({path:path.join(output,'batch14-desktop-dark.png')});

    await page.setViewportSize({width:390,height:844});
    await page.waitForTimeout(300);
    assert.equal(await rail.evaluate(el=>el.inert),true);
    await page.locator('#mobile-menu').click();
    assert.equal(await rail.evaluate(el=>el.inert),false);
    assert.equal(await page.locator('.workspace').evaluate(el=>el.inert),true);
    const last = rail.locator('button').last(); await last.focus(); await page.keyboard.press('Tab');
    assert.equal(await rail.locator('button:visible').first().evaluate(el=>el===document.activeElement),true);
    await page.keyboard.press('Escape');
    assert.equal(await rail.evaluate(el=>el.inert),true);
    assert.equal(await page.locator('.workspace').evaluate(el=>el.inert),false);
    await page.waitForFunction(()=>document.activeElement===document.querySelector('#mobile-menu'));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    if(output)await page.screenshot({path:path.join(output,'batch14-mobile.png')});
    assert.deepEqual(errors, []);
    assert.deepEqual(failures, []);
    console.log('PASS FitOS set/rest/undo, progression, search, dark/light, rail hover/pin, mobile focus trap, zero runtime/module errors');
  } finally { await browser.close(); server?.kill(); }
})().catch(error=>{console.error(error);process.exitCode=1});
