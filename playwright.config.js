import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:8000', trace: 'retain-on-failure' },
  webServer: { command: 'npm run start -- --hostname 127.0.0.1 --port 8000', url: 'http://127.0.0.1:8000', reuseExistingServer: !process.env.CI, timeout: 120000 },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } }
  ]
});
