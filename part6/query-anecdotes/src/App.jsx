import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useAnecdotesQuery, useVoteAnecdote } from './hooks/useAnecdotes'
import { useNotify } from './NotificationContext'

const App = () => {
  const notify = useNotify()
  const result = useAnecdotesQuery()

  const voteAnecdoteMutation = useVoteAnecdote({
    onSuccess: anecdote => {
      notify(`you voted '${anecdote.content}'`)
    }
  })

  if (result.isPending) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return (
      <div>
        anecdote service not available due to problems in server
      </div>
    )
  }

  const anecdotes = result.data.toSorted((a, b) => b.votes - a.votes)

  const handleVote = anecdote => {
    voteAnecdoteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1
    })
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />

      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>

          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>
              vote
            </button>
          </div>
        </div>
      ))}

      <AnecdoteForm />
    </div>
  )
}

export default App