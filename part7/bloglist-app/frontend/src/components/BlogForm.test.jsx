import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, vi } from 'vitest'
import BlogForm from './BlogForm'

test('form calls event handler with right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const testUser = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')
  const createButton = screen.getByText('create')

  await testUser.type(titleInput, 'Testing forms with Vitest')
  await testUser.type(authorInput, 'Hamza')
  await testUser.type(urlInput, 'https://example.com/testing-forms')

  await testUser.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing forms with Vitest',
    author: 'Hamza',
    url: 'https://example.com/testing-forms'
  })
})
