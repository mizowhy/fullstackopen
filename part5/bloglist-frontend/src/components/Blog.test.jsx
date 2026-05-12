import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { test, expect } from 'vitest'
import Blog from './Blog'

test('renders blog title and author as a link', () => {
  const blog = {
    id: '123',
    title: 'Router blog',
    author: 'Hamza'
  }

  render(
    <MemoryRouter>
      <Blog blog={blog} />
    </MemoryRouter>
  )

  expect(screen.getByText('Router blog Hamza')).toBeDefined()
})