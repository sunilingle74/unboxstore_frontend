import { expect, test } from '@playwright/test'

test('cart sidebar: progress to free shipping, quantity, complete the set and remove', async ({ page }) => {
  await page.goto('/product/cropped-fitted-tee-black') // ₹990
  await page.getByRole('button', { name: 'S', exact: true }).click()
  await page.getByRole('button', { name: 'Add to Bag' }).click()

  const cart = page.getByRole('dialog', { name: 'Your Bag (1)' })
  await expect(cart.getByRole('heading', { name: /Your cart/ })).toBeVisible()
  await expect(cart.getByText('Spend ₹2,009 more for free shipping')).toBeVisible()
  await expect(cart.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '33')

  await cart.getByRole('button', { name: 'Increase quantity of Cropped Fitted Tee' }).click()
  await expect(page.getByRole('dialog', { name: 'Your Bag (2)' }).getByText('Spend ₹1,019 more')).toBeVisible()

  // A tee pairs with jeans → the only jeans in the catalogue
  const set = page.getByRole('region', { name: 'Complete the set' })
  await expect(set.getByRole('link', { name: 'High Rise Flare Jeans' }).last()).toBeVisible()
  await set.getByRole('button', { name: 'Quick add' }).click()
  await set.getByRole('button', { name: '28', exact: true }).click()

  const full = page.getByRole('dialog', { name: 'Your Bag (3)' })
  await expect(full.getByText('You’ve unlocked free shipping')).toBeVisible()
  await expect(full.getByText('₹5,270')).toBeVisible() // 2 × ₹990 + ₹3290

  await full.getByRole('button', { name: 'Remove High Rise Flare Jeans' }).click()
  await expect(page.getByRole('dialog', { name: 'Your Bag (2)' })).toBeVisible()

  await page.getByRole('dialog', { name: 'Your Bag (2)' }).getByRole('link', { name: 'Checkout' }).click()
  await expect(page).toHaveURL(/\/login\?next=%2Fcheckout/)
})
