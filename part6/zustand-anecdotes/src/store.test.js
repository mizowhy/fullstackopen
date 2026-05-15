import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, {
  useAnecdotes,
  useAnecdoteActions
} from './store'

beforeEach(() => {
  useAnecdoteStore.setState({
    anecdotes: [],
    filter: '',
    notification: null,
    notificationTimeoutId: null
  })

  vi.clearAllMocks()
})

describe('anecdote store initialization', () => {
  it('state is initialized with anecdotes returned by backend', async () => {
    const mockAnecdotes = [
      {
        id: '1',
        content: 'First test anecdote',
        votes: 0
      },
      {
        id: '2',
        content: 'Second test anecdote',
        votes: 3
      }
    ]

    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())

    expect(anecdotesResult.current).toHaveLength(2)
    expect(anecdotesResult.current).toEqual([
      {
        id: '2',
        content: 'Second test anecdote',
        votes: 3
      },
      {
        id: '1',
        content: 'First test anecdote',
        votes: 0
      }
    ])
  })
})

describe('anecdote sorting', () => {
  it('useAnecdotes returns anecdotes sorted by votes descending', () => {
    const anecdotes = [
      {
        id: '1',
        content: 'Low votes anecdote',
        votes: 1
      },
      {
        id: '2',
        content: 'High votes anecdote',
        votes: 10
      },
      {
        id: '3',
        content: 'Middle votes anecdote',
        votes: 5
      }
    ]

    useAnecdoteStore.setState({
      anecdotes,
      filter: ''
    })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current.map(anecdote => anecdote.content)).toEqual([
      'High votes anecdote',
      'Middle votes anecdote',
      'Low votes anecdote'
    ])
  })
})

describe('anecdote filtering', () => {
  it('useAnecdotes returns a properly filtered list of anecdotes', () => {
    const anecdotes = [
      {
        id: '1',
        content: 'React state management',
        votes: 1
      },
      {
        id: '2',
        content: 'Zustand makes state simple',
        votes: 5
      },
      {
        id: '3',
        content: 'Testing React applications',
        votes: 3
      }
    ]

    useAnecdoteStore.setState({
      anecdotes,
      filter: 'react'
    })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current).toHaveLength(2)
    expect(result.current.map(anecdote => anecdote.content)).toEqual([
      'Testing React applications',
      'React state management'
    ])
  })
})

describe('voting', () => {
  it('voting increases the number of votes for an anecdote', async () => {
    const anecdote = {
      id: '1',
      content: 'Voting test anecdote',
      votes: 0
    }

    const updatedAnecdote = {
      ...anecdote,
      votes: 1
    }

    useAnecdoteStore.setState({
      anecdotes: [anecdote],
      filter: ''
    })

    anecdoteService.update.mockResolvedValue(updatedAnecdote)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.vote('1')
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())

    expect(anecdotesResult.current[0].votes).toBe(1)
    expect(anecdoteService.update).toHaveBeenCalledWith('1', updatedAnecdote)
  })
})