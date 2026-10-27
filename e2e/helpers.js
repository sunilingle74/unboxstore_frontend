import fs from 'node:fs'
import path from 'node:path'
import { expect } from '@playwright/test'
import { OUTBOX_DIR } from '../playwright.config.js'

let phoneCounter = 0
// Unique per run so OTP cooldowns and "number already registered" never collide.
export function uniquePhone() {
  phoneCounter += 1
  return `9${String(Date.now()).slice(-7)}${String(phoneCounter).padStart(2, '0')}`
}

export function uniqueEmail(prefix) {
  return `${prefix}.${Date.now()}${phoneCounter}@example.com`
}

// Fills the mobile number, sends the code, then types the dev-mode code shown on screen.
export async function completeOtp(page, phone) {
  await page.getByLabel('Mobile number').fill(phone)
  await page.getByRole('button', { name: /send code|verify mobile number/i }).click()
  const devOtp = page.getByTestId('dev-otp')
  await expect(devOtp).toBeVisible()
  const code = (await devOtp.locator('strong').textContent()).trim()
  await page.getByLabel('Verification code').fill(code)
  await page.getByRole('button', { name: 'Verify & continue' }).click()
}

export async function addToBag(page, slug, size = 'M') {
  await page.goto(`/product/${slug}`)
  await page.getByRole('button', { name: size, exact: true }).click()
  await page.getByRole('button', { name: 'Add to Bag' }).click()
  await expect(page.getByRole('button', { name: /Added to Bag/ })).toBeVisible()
}

// Mail written by the API's offline transport, newest last.
export function readOutbox() {
  if (!fs.existsSync(OUTBOX_DIR)) return []
  return fs
    .readdirSync(OUTBOX_DIR)
    .filter((f) => f.endsWith('.eml'))
    .sort()
    .map((f) => {
      const raw = fs.readFileSync(path.join(OUTBOX_DIR, f), 'utf8')
      const header = (name) => raw.match(new RegExp(`^${name}: (.+)$`, 'mi'))?.[1].trim()
      // Bodies are quoted-printable; undo soft line breaks and =XX escapes.
      const decoded = decodeQuotedPrintable(raw)
      return { file: f, raw, decoded, to: header('To'), subject: header('Subject') }
    })
}

// =XX escapes are UTF-8 bytes (₹ is =E2=82=B9), so decode to bytes first.
function decodeQuotedPrintable(raw) {
  const unfolded = raw.replace(/=\r?\n/g, '')
  const bytes = []
  for (let i = 0; i < unfolded.length; i++) {
    const hex = unfolded[i] === '=' && unfolded.slice(i + 1, i + 3)
    if (hex && /^[0-9A-F]{2}$/.test(hex)) {
      bytes.push(parseInt(hex, 16))
      i += 2
    } else {
      bytes.push(...Buffer.from(unfolded[i], 'utf8'))
    }
  }
  return Buffer.from(bytes).toString('utf8')
}

export async function waitForEmail(predicate, timeout = 10_000) {
  let match
  await expect
    .poll(() => (match = readOutbox().find(predicate)), { timeout, message: 'expected email in outbox' })
    .toBeTruthy()
  return match
}
