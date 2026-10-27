import { expect, test } from '@playwright/test'
import { addToBag, completeOtp, readOutbox, uniqueEmail, uniquePhone, waitForEmail } from './helpers.js'

const TEE = 'cropped-fitted-tee-black' // ₹990
const JEANS = 'high-rise-flare-jeans-mid-blue' // ₹3290, waist sizes

async function fillAddress(page, { name = 'Asha Rao', phone }) {
  await page.getByLabel('Full name').fill(name)
  await page.getByLabel('Mobile number', { exact: true }).fill(phone)
  await page.getByLabel('Pincode', { exact: true }).fill('560001')
  await page.getByLabel('Address', { exact: true }).fill('12 MG Road, Ashok Nagar')
  await page.getByLabel('City', { exact: true }).fill('Bengaluru')
  await page.getByLabel('State', { exact: true }).fill('Karnataka')
}

test.describe('Browsing as a guest', () => {
  test('shop menu → category → product → bag, then checkout asks to sign in', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Shop' }).hover()
    await page.getByRole('link', { name: 'Hoodies & Sweatshirts' }).first().click()
    await expect(page).toHaveURL(/category=hoodies-and-sweatshirts/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Hoodies & Sweatshirts')

    await page.getByRole('link', { name: /Oversized Fleece Hoodie/ }).first().click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Oversized Fleece Hoodie')

    await page.getByRole('button', { name: 'Add to Bag' }).click()
    await expect(page.getByText('Please select a size.')).toBeVisible()
    await page.getByRole('button', { name: 'L', exact: true }).click()
    await page.getByRole('button', { name: 'Add to Bag' }).click()
    await expect(page.getByRole('dialog', { name: 'Your Bag (1)' })).toBeVisible()

    await page.getByRole('link', { name: 'View cart' }).click()
    await expect(page).toHaveURL(/\/cart$/)
    await page.getByRole('link', { name: /Checkout — ₹/ }).click()
    await expect(page).toHaveURL(/\/login\?next=%2Fcheckout/)
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
  })

  test('navbar account and wishlist icons reach real pages', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Account' }).click()
    await expect(page).toHaveURL(/\/login\?next=%2Faccount/)

    await page.goto(`/product/${TEE}`)
    await page.getByRole('button', { name: 'Toggle wishlist' }).first().click()
    await page.getByRole('banner').getByRole('link', { name: 'Wishlist' }).click()
    await expect(page).toHaveURL(/\/wishlist$/)
    await expect(page.getByRole('link', { name: /Cropped Fitted Tee/ }).first()).toBeVisible()
  })
})

test.describe('New customer — mobile sign-up through to invoice email', () => {
  test('signs up at checkout with an OTP, pays cash on delivery and gets an emailed invoice', async ({ page }) => {
    const phone = uniquePhone()
    const email = uniqueEmail('asha')

    await addToBag(page, TEE, 'S')
    await addToBag(page, JEANS, '28')
    await page.goto('/cart')
    await page.getByPlaceholder('Promo code').fill('welcome10')
    await page.getByRole('button', { name: 'Apply' }).click()
    await expect(page.getByText('WELCOME10 applied')).toBeVisible()
    await page.getByRole('link', { name: /Checkout — ₹/ }).click()

    // Unknown number → OTP → profile step → back to checkout
    await completeOtp(page, phone)
    await expect(page.getByRole('heading', { name: 'Tell us about you' })).toBeVisible()
    await page.getByLabel('Full name').fill('Asha Rao')
    await page.getByLabel('Email', { exact: true }).fill(email)
    await page.getByRole('button', { name: 'Create account' }).click()
    await expect(page).toHaveURL(/\/checkout$/)
    await expect(page.getByLabel('Email', { exact: true })).toHaveValue(email)

    // Validation before anything is submitted
    await page.getByRole('button', { name: /^Pay ₹/ }).click()
    await expect(page.getByText('Enter a 6-digit pincode')).toBeVisible()

    await fillAddress(page, { phone })
    // ₹990 + ₹3290 = ₹4280, -10% = ₹3852, free shipping, 5% tax ₹193 → ₹4045
    await expect(page.getByTestId('checkout-total')).toHaveText('₹4,045')
    await expect(page.getByLabel(/^UPI/)).toBeChecked()

    // Cash on delivery adds a ₹100 fee that is paid online now
    await page.getByLabel(/^Cash on delivery/).check()
    await expect(page.getByTestId('checkout-total')).toHaveText('₹4,145')
    await expect(page.getByText('Pay on delivery (cash)')).toBeVisible()
    await page.getByRole('button', { name: 'Pay ₹100 & place order' }).click()
    const payment = page.getByRole('dialog', { name: 'Pay ₹100' })
    await payment.getByRole('button', { name: 'Simulate successful payment' }).click()

    await expect(page).toHaveURL(/\/order\/[a-f0-9]{24}$/)
    await expect(page.getByRole('heading', { name: 'Thank you for your order' })).toBeVisible()
    await expect(page.getByTestId('order-total')).toHaveText('₹4145') // server agrees with the bag
    await expect(page.getByText('Cash on delivery — ₹4,045 due on delivery')).toBeVisible()
    const orderNumber = (await page.getByTestId('order-number').textContent()).trim()

    // Bag is emptied after ordering
    await expect(page.getByRole('button', { name: 'Cart' })).not.toContainText(/\d/)

    // Welcome + confirmation emails, with the invoice PDF attached
    await waitForEmail((m) => m.to === email && m.subject === 'Welcome to unboxstore')
    const confirmation = await waitForEmail((m) => m.to === email && m.subject === `Order ${orderNumber} confirmed`)
    expect(confirmation.raw).toMatch(/Content-Type: application\/pdf; name=INV-\d+\.pdf/)
    expect(confirmation.decoded).toContain('Cash on delivery')
    expect(confirmation.decoded).toContain('₹100 COD fee paid online')
    expect(confirmation.decoded).toContain('₹4045</strong> ready on delivery')

    // Invoice download from the order page
    await page.getByRole('link', { name: 'View order' }).click()
    const download = page.waitForEvent('download')
    await page.getByRole('link', { name: 'Download invoice' }).click()
    expect((await download).suggestedFilename()).toMatch(/^INV-\d+\.pdf$/)

    // Account shows the order and the saved address is reused next time
    await page.getByRole('link', { name: '← My account' }).click()
    await expect(page.getByRole('heading', { name: 'Hi, Asha' })).toBeVisible()
    await expect(page.getByRole('link', { name: new RegExp(orderNumber) })).toContainText('Processing')

    await addToBag(page, TEE, 'M')
    await page.goto('/checkout')
    await expect(page.getByLabel('Pincode', { exact: true })).toHaveValue('560001')
    await expect(page.getByLabel('City', { exact: true })).toHaveValue('Bengaluru')

    // Sign out, then sign back in with the same number (no profile step this time)
    await page.goto('/account')
    await page.getByRole('button', { name: 'Sign out' }).click()
    await expect(page).toHaveURL(/\/$/)
    await page.goto('/login')
    await completeOtp(page, phone)
    await expect(page).toHaveURL(/\/account$/)
    await expect(page.getByRole('link', { name: new RegExp(orderNumber) })).toBeVisible()
  })

  test('sign-up page collects name and email before verifying the number', async ({ page }) => {
    const phone = uniquePhone()
    const email = uniqueEmail('ravi')

    await page.goto('/signup')
    await page.getByLabel('Mobile number').fill(phone)
    await page.getByRole('button', { name: 'Verify mobile number' }).click()
    await expect(page.getByText('Enter your name')).toBeVisible()

    await page.getByLabel('Full name').fill('Ravi Kumar')
    await page.getByLabel('Email', { exact: true }).fill(email)
    await completeOtp(page, phone)
    await expect(page).toHaveURL(/\/account$/)
    await expect(page.getByRole('heading', { name: 'Hi, Ravi' })).toBeVisible()
    await expect(page.getByLabel('Mobile number', { exact: true })).toHaveValue(`+91 ${phone}`)

    // Optional password unlocks email sign-in
    await page.getByLabel('New password').fill('Ravi@2026')
    await page.getByRole('button', { name: 'Save password' }).click()
    await expect(page.getByText('Password saved.')).toBeVisible()
    await page.getByRole('button', { name: 'Sign out' }).click()

    await page.goto('/login/email')
    await page.getByLabel('Email', { exact: true }).fill(email)
    await page.getByLabel('Password').fill('Ravi@2026')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/\/account$/)
  })

  test('rejects bad input on the OTP screens', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Mobile number').fill('12345')
    await page.getByRole('button', { name: 'Send code' }).click()
    await expect(page.getByRole('alert')).toHaveText('Enter a valid 10-digit mobile number')

    await page.getByLabel('Mobile number').fill(uniquePhone())
    await page.getByRole('button', { name: 'Send code' }).click()
    await page.getByLabel('Verification code').fill('000000')
    await page.getByRole('button', { name: 'Verify & continue' }).click()
    await expect(page.getByRole('alert')).toHaveText('Incorrect code')
    await expect(page.getByText(/Resend code in \d+s/)).toBeVisible()
  })
})

test.describe('Email sign-in and password recovery', () => {
  test('forgot password emails a reset link that signs the customer in', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('link', { name: 'Sign in with email' }).click()
    await page.getByLabel('Email', { exact: true }).fill('existing@example.com')
    await page.getByLabel('Password').fill('wrong-password')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByRole('alert')).toHaveText('Invalid email or password')

    await page.getByRole('link', { name: 'Forgot password?' }).click()
    await expect(page.getByRole('heading', { name: 'Forgot your password?' })).toBeVisible()
    await page.getByLabel('Email', { exact: true }).fill('existing@example.com')
    await page.getByRole('button', { name: 'Send reset link' }).click()
    await expect(page.getByRole('status')).toContainText('a reset link is on its way')

    const mail = await waitForEmail((m) => m.to === 'existing@example.com' && /Reset your/.test(m.subject))
    const resetUrl = mail.decoded.match(/https?:\/\/[^"\s]+\/reset-password\?token=[a-f0-9]+/)[0]

    await page.goto(new URL(resetUrl).pathname + new URL(resetUrl).search)
    await page.getByLabel('New password').fill('NewSecret@1')
    await page.getByLabel('Confirm password').fill('NewSecret@1')
    await page.getByRole('button', { name: /Save password/ }).click()
    await expect(page).toHaveURL(/\/account$/)
    await expect(page.getByRole('heading', { name: 'Hi, Existing' })).toBeVisible()
    await waitForEmail((m) => m.to === 'existing@example.com' && /password was changed/.test(m.subject))

    // The link is single-use
    await page.getByRole('button', { name: 'Sign out' }).click()
    await page.goto(new URL(resetUrl).pathname + new URL(resetUrl).search)
    await page.getByLabel('New password').fill('Another@1')
    await page.getByLabel('Confirm password').fill('Another@1')
    await page.getByRole('button', { name: /Save password/ }).click()
    await expect(page.getByRole('alert')).toHaveText('This reset link is invalid or has expired')
  })

  test('forgot password does not reveal whether an email is registered', async ({ page }) => {
    const before = readOutbox().length
    await page.goto('/forgot-password')
    await page.getByLabel('Email', { exact: true }).fill('nobody@example.com')
    await page.getByRole('button', { name: 'Send reset link' }).click()
    await expect(page.getByRole('status')).toContainText('a reset link is on its way')
    expect(readOutbox().length).toBe(before)
  })
})

test.describe('Mobile', () => {
  test('@mobile browse from the menu, sign in with OTP and place an order', async ({ page }) => {
    const phone = uniquePhone()

    await page.goto('/')
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('dialog', { name: 'Menu' }).getByRole('link', { name: 'T-Shirts' }).click()
    await expect(page).toHaveURL(/category=t-shirts/)
    await page.getByRole('link', { name: /Heavyweight Crew Tee/ }).first().click()
    await page.getByRole('button', { name: 'M', exact: true }).click()
    await page.getByRole('button', { name: 'Add to Bag' }).click()
    await page.getByRole('link', { name: 'View cart' }).click()
    await page.getByRole('link', { name: /Checkout — ₹/ }).click()

    await completeOtp(page, phone)
    await page.getByLabel('Full name').fill('Meera Shah')
    await page.getByLabel('Email', { exact: true }).fill(uniqueEmail('meera'))
    await page.getByRole('button', { name: 'Create account' }).click()

    await fillAddress(page, { name: 'Meera Shah', phone })
    // ₹1290 + ₹149 shipping + ₹65 tax, paid in full by UPI
    await page.getByRole('button', { name: 'Pay ₹1,504' }).click()
    await page.getByRole('button', { name: 'Simulate successful payment' }).click()
    await expect(page.getByRole('heading', { name: 'Thank you for your order' })).toBeVisible()
  })
})
