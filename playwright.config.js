import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ...devices['Desktop Chrome']
  },
  webServer: [
    {
      command: 'npm run dev:api',
      url: 'http://127.0.0.1:4000/health',
      reuseExistingServer: true,
      timeout: 180_000
    },
    {
      command: 'npm run dev:web',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: true,
      timeout: 120_000
    }
  ]
});
