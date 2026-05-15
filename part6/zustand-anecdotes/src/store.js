import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  notification: null,
  notificationTimeoutId: null,
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },

    vote: async id => {
      const anecdote = get().anecdotes.find(a => a.id === id)

      const updatedAnecdote = {
        ...anecdote,
        votes: anecdote.votes + 1
      }

      const returnedAnecdote = await anecdoteService.update(id, updatedAnecdote)

      set(state => ({
        anecdotes: state.anecdotes.map(a =>
          a.id !== id ? a : returnedAnecdote
        )
      }))

      get().actions.setNotification(
        `you voted '${returnedAnecdote.content}'`
      )
    },

    add: async content => {
      const newAnecdote = await anecdoteService.createNew(content)

      set(state => ({
        anecdotes: state.anecdotes.concat(newAnecdote)
      }))

      get().actions.setNotification(
        `you created '${newAnecdote.content}'`
      )
    },

    remove: async id => {
      await anecdoteService.remove(id)

      set(state => ({
        anecdotes: state.anecdotes.filter(a => a.id !== id)
      }))
    },

    setFilter: filter => set(() => ({ filter })),

    setNotification: message => {
      const currentTimeoutId = get().notificationTimeoutId

      if (currentTimeoutId) {
        clearTimeout(currentTimeoutId)
      }

      set(() => ({ notification: message }))

      const timeoutId = setTimeout(() => {
        set(() => ({
          notification: null,
          notificationTimeoutId: null
        }))
      }, 5000)

      set(() => ({ notificationTimeoutId: timeoutId }))
    }
  }
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore(state => state.filter)

  return anecdotes
    .filter(anecdote =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
    .toSorted((a, b) => b.votes - a.votes)
}

export const useAnecdoteActions = () =>
  useAnecdoteStore(state => state.actions)

export const useFilter = () =>
  useAnecdoteStore(state => state.filter)

export const useNotification = () =>
  useAnecdoteStore(state => state.notification)

export default useAnecdoteStore