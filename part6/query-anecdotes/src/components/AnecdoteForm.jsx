import { useCreateAnecdote } from '../hooks/useAnecdotes'
import { useNotify } from '../NotificationContext'

const AnecdoteForm = () => {
  const notify = useNotify()

  const createAnecdoteMutation = useCreateAnecdote({
    onSuccess: anecdote => {
      notify(`anecdote '${anecdote.content}' created`)
    },
    onError: error => {
      notify(error.message, 'error')
    }
  })

  const onCreate = event => {
    event.preventDefault()

    const content = event.target.anecdote.value

    createAnecdoteMutation.mutate(content)
    event.target.reset()
  }

  return (
    <div>
      <h3>create new</h3>

      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm