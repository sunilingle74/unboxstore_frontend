import { defineConfig, devices } from '@playwright/test'
import path from 'node:path'

// End-to-end tests run against their own API (port 5055), storefront (5175)
// and database (atelier_e2e), so they never touch dev data. SMS, SMTP,
// Razorpay and Shiprocket are forced off: OTPs come back as `devCode` and
// emails land in e2e/.outbox as .eml files.
const API_PORT = 5055
const WEB_PORT = 5175
export const OUTBOX_DIR = path.resolve('e2e/.outbox')

const backendEnv = {
  PORT: String(API_PORT),
  NODE_ENV: 'test',
  MONGODB_URI: 'mongodb://127.0.0.1:27017/atelier_e2e',
  CLIENT_URL: `http://localhost:${WEB_PORT}`,
  MAIL_OUTBOX_DIR: OUTBOX_DIR,
  SMTP_HOST: '',
  TWILIO_ACCOUNT_SID: '',
  RAZORPAY_KEY_ID: '',
  RAZORPAY_KEY_SECRET: '',
  SHIPROCKET_EMAIL: '',
}

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.js',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'e2e/.report' }]],
  outputDir: 'e2e/.results',
  use: {
    baseURL: `http://localhost:${WEB_PORT}`,
    // Newsletter popup pre-dismissed so it never covers a journey; the popup
    // has its own tests that start from an empty storage state.
    storageState: 'e2e/storage-state.json',
    channel: 'chrome',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome' }, grepInvert: /@mobile/ },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome' }, grep: /@mobile/ },
  ],
  webServer: [
    {
      command: 'node server.js',
      cwd: '../backend',
      env: backendEnv,
      url: `http://localhost:${API_PORT}/api/health`,
      reuseExistingServer: false,
    },
    {
      command: `npx vite --port ${WEB_PORT} --strictPort`,
      env: { API_PROXY_TARGET: `http://localhost:${API_PORT}` },
      url: `http://localhost:${WEB_PORT}`,
      reuseExistingServer: false,
    },
  ],
})
