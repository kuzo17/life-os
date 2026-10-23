import { defineConfig } from 'vitest/config';

export default defineConfig({ test: {
  include: ['tests/emulator/**/*.test.ts'], environment: 'node',
  fileParallelism: false, maxWorkers: 1, testTimeout: 15000,
} });
