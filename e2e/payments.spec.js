import { expect, test } from '@playwright/test'
import { addToBag, completeOtp, uniqueEmail, uniquePhone } from './helpers.js'

test('a failed payment keeps the bag and creates no visible order; paying by card then succeeds', async ({ page }) => {
  const phone = uniquePhone()
  await addToBag(page, 'zip-bomber-sweatshirt-black', 'M') // ₹3290 → free shipping, ₹165 tax
  await page.goto('/checkout')
  await completeOtp(page, phone)
  await page.getByLabel('Full name').fill('Kiran Das')
  await page.getByLabel('Email', { exact: true }).fill(uniqueEmail('kiran'))
  await page.getByRole('button', { name: 'Create account' }).click()

  await page.getByLabel('Full name').fill('Kiran Das')
  await page.getByLabel('Mobile number', { exact: true }).fill(phone)
  await page.getByLabel('Pincode', { exact: true }).fill('400001')
  await page.getByLabel('Address', { exact: true }).fill('5 Marine Drive')
  await page.getByLabel('City', { exact: true }).fill('Mumbai')
  await page.getByLabel('State', { exact: true }).fill('Maharashtra')

  await page.getByLabel(/^Cash on delivery/).check()
  await page.getByRole('button', { name: 'Pay ₹100 & place order' }).click()
  await page.getByRole('button', { name: 'Simulate failed payment' }).click()
  await expect(page.getByRole('alert')).toContainText('Payment failed')
  await expect(page).toHaveURL(/\/checkout$/)

  // Retry straight away with a card — the form keeps everything entered
  await expect(page.getByLabel('City', { exact: true })).toHaveValue('Mumbai')
  await page.getByLabel(/^Card/).check()
  await expect(page.getByTestId('checkout-total')).toHaveText('₹3,455')
  await page.getByRole('button', { name: 'Pay ₹3,455' }).click()
  await expect(page.getByRole('dialog', { name: 'Pay ₹3,455' })).toContainText('via Card')
  await page.getByRole('button', { name: 'Simulate successful payment' }).click()

  await expect(page.getByRole('heading', { name: 'Thank you for your order' })).toBeVisible()
  await expect(page.getByText('Paid online · Card')).toBeVisible()
  await expect(page.getByText('COD fee')).toHaveCount(0)

  // The abandoned COD attempt never shows up as an order
  await page.getByRole('link', { name: 'View order' }).click()
  await page.getByRole('link', { name: '← My account' }).click()
  await expect(page.getByRole('heading', { name: 'Orders' }).locator('..').getByRole('listitem')).toHaveCount(1)
})
