const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'hamza',
        name: 'Hamza',
        password: 'sekret'
      }
    })

    await page.goto('http://localhost:5173')
    await page.evaluate(() => {
      window.localStorage.clear()
    })
    await page.reload()
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()

    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()

      await page.getByLabel('username').fill('hamza')
      await page.getByLabel('password').fill('sekret')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Hamza logged in')).toBeVisible()
      await expect(page).toHaveURL('http://localhost:5173/')
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()

      await page.getByLabel('username').fill('hamza')
      await page.getByLabel('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Hamza logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()

      await page.getByLabel('username').fill('hamza')
      await page.getByLabel('password').fill('sekret')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Hamza logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('link', { name: 'create new' }).click()

      await page.getByLabel('title:').fill('Playwright routed blog')
      await page.getByLabel('author:').fill('Hamza')
      await page.getByLabel('url:').fill('https://example.com/playwright-routed')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(page).toHaveURL('http://localhost:5173/')
      await expect(page.getByText('Playwright routed blog Hamza')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('link', { name: 'create new' }).click()

      await page.getByLabel('title:').fill('Likeable routed blog')
      await page.getByLabel('author:').fill('Hamza')
      await page.getByLabel('url:').fill('https://example.com/likeable-routed')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByText('Likeable routed blog Hamza').click()

      await expect(page.getByText(/likes 0/)).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText(/likes 1/)).toBeVisible()
    })

    test('a blog can be deleted by the user who created it', async ({ page }) => {
      await page.getByRole('link', { name: 'create new' }).click()

      await page.getByLabel('title:').fill('Deletable routed blog')
      await page.getByLabel('author:').fill('Hamza')
      await page.getByLabel('url:').fill('https://example.com/deletable-routed')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByText('Deletable routed blog Hamza').click()

      page.on('dialog', async dialog => {
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page).toHaveURL('http://localhost:5173/')
      await expect(page.getByText('Deletable routed blog Hamza')).not.toBeVisible()
    })

    test('a logged-in user can like blogs', async ({ page }) => {
      await page.getByRole('link', { name: 'create new' }).click()

      await page.getByLabel('title:').fill('Second like test blog')
      await page.getByLabel('author:').fill('Hamza')
      await page.getByLabel('url:').fill('https://example.com/second-like-test')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByText('Second like test blog Hamza').click()

      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText(/likes 2/)).toBeVisible()
    })
  })
})