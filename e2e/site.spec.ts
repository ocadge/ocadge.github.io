import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// GitHub Pages serves 404.html for unknown addresses; the local preview server doesn't, so test it directly.
const PAGES = ['/', '/explorer/', '/bike/', '/404.html']

// Collects console errors, which is also where the browser reports anything the CSP blocks.
function watchErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))
  return errors
}

for (const path of PAGES) {
  test(`${path} loads with no console errors or CSP blocks`, async ({ page }) => {
    const errors = watchErrors(page)
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    expect(errors).toEqual([])
  })

  for (const width of [400, 1280]) {
    for (const colorScheme of ['light', 'dark'] as const) {
      test(`${path} has no axe violations at ${width}px in ${colorScheme}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.emulateMedia({ colorScheme })
        await page.goto(path)
        await page.waitForLoadState('networkidle')
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
        expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual(
          [],
        )
      })
    }
  }
}

test('the 404 page links back home', async ({ page }) => {
  await page.goto('/404.html')
  await page.getByRole('link', { name: 'Back to my portfolio' }).click()
  await expect(page).toHaveURL('/')
})

test('every nav link reaches its section', async ({ page }) => {
  await page.goto('/')
  const links = page.getByRole('navigation', { name: 'Main' }).getByRole('link')
  const count = await links.count()
  expect(count).toBeGreaterThan(0)
  for (let i = 0; i < count; i++) {
    const link = links.nth(i)
    const href = await link.getAttribute('href')
    await link.click()
    await expect(page.locator(href ?? '')).toBeInViewport()
  }
})

async function fillForm(page: Page) {
  await page.goto('/#contact')
  await page.getByLabel('Name').fill('Test Person')
  await page.getByLabel('Email').fill('test.person@example.org')
  await page.getByLabel('Message').fill('Hello from the end-to-end tests.')
  // The form ignores anything sent in under 3 seconds, like a bot would.
  await page.waitForTimeout(3100)
}

test('the form shows the thanks and moves focus there when the message is accepted', async ({ page }) => {
  await page.route('https://formspree.io/**', (route) => route.fulfill({ status: 200, json: { ok: true } }))
  await fillForm(page)
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByRole('status')).toContainText('your message is sent')
  await expect(page.getByRole('status')).toBeFocused()
})

test('the form shows an error and keeps the message when the request fails', async ({ page }) => {
  await page.route('https://formspree.io/**', (route) => route.fulfill({ status: 500 }))
  await fillForm(page)
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByRole('alert')).toContainText("didn't send")
  await expect(page.getByLabel('Message')).toHaveValue('Hello from the end-to-end tests.')
})

test('the bike workshop blocks a step until its parts are restocked', async ({ page }) => {
  await page.goto('/bike/')
  const orders = page.locator('.bike-order')
  // Order 1 builds its wheels, which uses the last two 29-inch wheels.
  await orders.nth(0).getByRole('button', { name: 'Do this step' }).click()
  // Order 2 also needs 29-inch wheels, so it gets stuck at that step.
  const second = orders.nth(1)
  await second.getByRole('button', { name: 'Do this step' }).click()
  await second.getByRole('button', { name: 'Do this step' }).click()
  await expect(second).toContainText('Blocked: needs 2 × Wheel, 29 inch')

  // The page load check doesn't see this state, so check accessibility here too.
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations.map((v) => v.id)).toEqual([])

  await page.getByRole('button', { name: '+5 Wheel, 29 inch' }).click()
  await expect(second).not.toContainText('Blocked')
  await expect(second).toContainText('Step 3 of 7: Build the wheels.')
})
