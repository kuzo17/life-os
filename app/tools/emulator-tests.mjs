import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';
import { readFile } from 'node:fs/promises';
import { once } from 'node:events';
import process from 'node:process';
import console from 'node:console';
import { URL } from 'node:url';
import { dirname, join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { jarPath, installBinary, verifyBinary } from './emulator-binary.mjs';

if (process.argv[2] === '--install') { await installBinary(); }
else {
  await verifyBinary();
  const java = process.env.LIFEOS_TEST_JAVA || 'java';
  const javaCheck = spawnSync(java, ['-version'], { encoding: 'utf8', windowsHide: true, timeout: 5000 });
  if (javaCheck.error || javaCheck.status !== 0 || !/version "21\./.test(javaCheck.stdout + javaCheck.stderr)) throw new Error('I test emulatore richiedono Java 21. Usa LIFEOS_TEST_JAVA per un runtime portabile.');
  // Non collegarsi a un servizio già presente sulla stessa porta.
  const probe = createServer();
  await new Promise((resolve, reject) => { probe.once('error', reject); probe.listen(8900, '127.0.0.1', resolve); });
  await new Promise((resolve, reject) => probe.close(error => error ? reject(error) : resolve()));
  const emulator = spawn(java, ['-Xmx256m', '-Duser.language=en', '-Djava.net.preferIPv4Stack=true', '-jar', jarPath, '--host', '127.0.0.1', '--port', '8900'], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  let log = '';
  emulator.stdout.on('data', data => { log = (log + data).slice(-16000); });
  emulator.stderr.on('data', data => { log = (log + data).slice(-16000); });
  const exited = once(emulator, 'exit');
  const shutdown = () => { if (emulator.exitCode === null) emulator.kill(); };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
  try {
    const deadline = Date.now() + 25000;
    while (!/Listening at.*127\.0\.0\.1:8900/i.test(log)) {
      if (emulator.exitCode !== null || Date.now() > deadline) throw new Error(`Emulatore non avviato: ${log}`);
      await delay(100);
    }
    const rules = await readFile(new URL('../tests/emulator/database.rules.json', import.meta.url), 'utf8');
    const response = await globalThis.fetch('http://127.0.0.1:8900/.settings/rules.json?ns=demo-lifeos-contract', {
      method: 'PUT', headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' }, body: rules,
      redirect: 'error', signal: globalThis.AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error('Regole di prova rifiutate.');
    console.log('RTDB ufficiale, solo loopback: regole di contratto caricate, nessun progetto reale.');
    const require = createRequire(import.meta.url);
    const tests = spawn(process.execPath, [join(dirname(require.resolve('vitest/package.json')), 'vitest.mjs'), 'run', '--config', 'vitest.emulator.config.ts'], { stdio: 'inherit', windowsHide: true });
    const [code] = await once(tests, 'exit');
    process.exitCode = code ?? 1;
  } finally {
    shutdown();
    await exited;
    process.removeListener('SIGINT', shutdown);
    process.removeListener('SIGTERM', shutdown);
  }
}
