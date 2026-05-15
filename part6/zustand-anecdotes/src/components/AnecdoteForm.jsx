import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()

  const createAnecdote = async event => {
    event.preventDefault()

    const content = event.target.anecdote.value

    if (content.trim().length === 0) {
      return
    }

    await add(content)
    event.target.reset()
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={createAnecdote}>
        <div>
          <input name="anecdote" />
        </div>

        <button type="submit">
          create
        </button>
      </form>
    </div>
  )
}

export default AnecdoteForm