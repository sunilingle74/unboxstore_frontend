import fs from 'node:fs'
import { createRequire } from 'node:module'
import { OUTBOX_DIR } from '../playwright.config.js'

const require = createRequire(import.meta.url)

export default async function globalSetup() {
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/atelier_e2e'
  await require('./reset-db.cjs').resetDb()
  fs.rmSync(OUTBOX_DIR, { recursive: true, force: true })
  fs.mkdirSync(OUTBOX_DIR, { recursive: true })
}
