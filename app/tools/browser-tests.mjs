import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import process from 'node:process';

const require = createRequire(import.meta.url);
const install = process.argv[2] === '--install';
const args = install
  ? ['install', 'chromium', 'firefox', 'webkit', ...process.argv.slice(3)]
  : ['test', ...process.argv.slice(2)];
const result = spawnSync(process.execPath, [require.resolve('@playwright/test/cli'), ...args], {
  stdio: 'inherit',
  windowsHide: true,
  env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: resolve('.cache/browsers') },
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
