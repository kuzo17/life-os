import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: 2,
  forbidOnly: true,
  retries: 0,
  timeout: 30_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:8879', viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure', screenshot: 'off' },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
    { name: 'mobile-chromium', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: 'mobile-webkit', use: { browserName: 'webkit', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: [
    { command: 'node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 8879 --strictPort', url: 'http://127.0.0.1:8879', reuseExistingServer: false },
    { command: 'node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 8880 --strictPort --base /lifeos-preview/', url: 'http://127.0.0.1:8880/lifeos-preview/', reuseExistingServer: false },
  ],
});
