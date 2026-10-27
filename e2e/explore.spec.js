import { expect, test } from '@playwright/test'
import { waitForEmail } from './helpers.js'

test.describe('Explore page', () => {
  test('replaces Contact in the navbar and links collections to the shop', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('banner').getByRole('navigation')
    await expect(nav.getByRole('link', { name: 'Contact' })).toHaveCount(0)
    await nav.getByRole('link', { name: 'Explore' }).click()

    await expect(page).toHaveURL(/\/explore$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Collections' })).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('Collections')
    await expect(page.getByRole('link', { name: 'Jackets & Coats, 5 products' })).toBeVisible()

    await page.getByRole('link', { name: 'Hoodies & Sweatshirts, 7 products' }).click()
    await expect(page).toHaveURL(/category=hoodies-and-sweatshirts/)
  })
})

test.describe('Empty states', () => {
  test('empty bag, empty wishlist, no search results and unknown pages', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Cart' }).click()
    const bag = page.getByRole('dialog', { name: 'Your Bag (0)' })
    await expect(bag.getByRole('heading', { name: 'It’s a little empty here' })).toBeVisible()
    await bag.getByRole('link', { name: 'Start shopping' }).click()
    await expect(page).toHaveURL(/\/shop$/)

    await page.goto('/cart')
    await expect(page.getByRole('heading', { level: 1, name: 'It’s a little empty here' })).toBeVisible()

    await page.goto('/wishlist')
    await expect(page.getByRole('heading', { name: 'Nothing saved yet' })).toBeVisible()

    await page.getByRole('button', { name: 'Search' }).click()
    await page.getByRole('textbox').first().fill('zzzz-not-a-product')
    await expect(page.getByRole('heading', { name: 'No matches found' })).toBeVisible()

    await page.goto('/this-page-does-not-exist')
    await expect(page.getByRole('heading', { level: 1, name: 'This page is nowhere to be found' })).toBeVisible()
    await page.getByRole('link', { name: 'Explore collections' }).click()
    await expect(page).toHaveURL(/\/explore$/)
  })
})

test.describe('Newsletter popup', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('appears for new visitors, subscribes, and stays away afterwards', async ({ page }) => {
    const email = `news.${Date.now()}@example.com`
    await page.goto('/explore')

    const popup = page.getByRole('dialog', { name: /Sign up for our newsletter/ })
    await expect(popup).toBeVisible({ timeout: 10_000 })
    await popup.getByRole('textbox', { name: 'Email address' }).fill('not-an-email')
    await popup.getByRole('button', { name: 'Subscribe' }).click()
    await expect(popup.getByRole('alert')).toHaveText('Enter a valid email address')

    await popup.getByRole('textbox', { name: 'Email address' }).fill(email)
    await popup.getByRole('button', { name: 'Subscribe' }).click()
    await expect(popup.getByRole('status')).toContainText("You're on the list")
    const mail = await waitForEmail((m) => m.to === email)
    expect(mail.decoded).toContain('WELCOME10')

    await popup.getByRole('button', { name: 'Continue shopping' }).click()
    await expect(popup).toBeHidden()
    await page.reload()
    await page.waitForTimeout(7000)
    await expect(popup).toBeHidden()
  })

  test('"No thanks" and Escape dismiss it, and it never interrupts checkout or sign-in', async ({ page }) => {
    await page.goto('/login')
    await page.waitForTimeout(7000)
    await expect(page.getByRole('dialog', { name: /Sign up for our newsletter/ })).toHaveCount(0)

    await page.goto('/')
    const popup = page.getByRole('dialog', { name: /Sign up for our newsletter/ })
    await expect(popup).toBeVisible({ timeout: 10_000 })
    await page.keyboard.press('Escape')
    await expect(popup).toBeHidden()
    await page.reload()
    await page.waitForTimeout(7000)
    await expect(popup).toBeHidden()
  })
})
