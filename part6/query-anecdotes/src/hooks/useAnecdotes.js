import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAnecdotes,
  createAnecdote,
  updateAnecdote
} from '../services/anecdotes'

export const useAnecdotesQuery = () => {
  return useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })
}

export const useCreateAnecdote = options => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAnecdote,
    onSuccess: anecdote => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })

      if (options?.onSuccess) {
        options.onSuccess(anecdote)
      }
    },
    onError: error => {
      if (options?.onError) {
        options.onError(error)
      }
    }
  })
}

export const useVoteAnecdote = options => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAnecdote,
    onSuccess: anecdote => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })

      if (options?.onSuccess) {
        options.onSuccess(anecdote)
      }
    }
  })
}