import { render, screen } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import BlogView from './BlogView'

const blog = {
  id: '123',
  title: 'Component testing is done with react-testing-library',
  author: 'Hamza',
  url: 'https://example.com/component-testing',
  likes: 7,
  user: {
    id: 'user123',
    username: 'hamza',
    name: 'Hamza'
  }
}

const creatorUser = {
  id: 'user123',
  username: 'hamza',
  name: 'Hamza'
}

const otherUser = {
  id: 'user456',
  username: 'otheruser',
  name: 'Other User'
}

test('blog information and likes are displayed to unauthenticated users, buttons are not displayed', () => {
  const updateBlog = vi.fn()
  const removeBlog = vi.fn()

  render(
    <BlogView
      blog={blog}
      user={null}
      updateBlog={updateBlog}
      removeBlog={removeBlog}
    />
  )

  expect(screen.getByText('Component testing is done with react-testing-library Hamza')).toBeDefined()
  expect(screen.getByText('https://example.com/component-testing')).toBeDefined()
  expect(screen.getByText(/likes 7/)).toBeDefined()
  expect(screen.getByText('added by Hamza')).toBeDefined()

  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

test('authenticated user who is not creator is shown only the like button', () => {
  const updateBlog = vi.fn()
  const removeBlog = vi.fn()

  render(
    <BlogView
      blog={blog}
      user={otherUser}
      updateBlog={updateBlog}
      removeBlog={removeBlog}
    />
  )

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.queryByText('remove')).toBeNull()
})

test('blog creator is shown both like and delete buttons', () => {
  const updateBlog = vi.fn()
  const removeBlog = vi.fn()

  render(
    <BlogView
      blog={blog}
      user={creatorUser}
      updateBlog={updateBlog}
      removeBlog={removeBlog}
    />
  )

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.getByText('remove')).toBeDefined()
})