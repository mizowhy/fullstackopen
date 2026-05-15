import { useNavigate } from 'react-router-dom'
import { useField, useAnecdotes } from '../hooks'

const CreateNew = () => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const navigate = useNavigate()
  const { addAnecdote } = useAnecdotes()

  const handleSubmit = async event => {
    event.preventDefault()

    await addAnecdote({
      content: content.input.value,
      author: author.input.value,
      info: info.input.value,
      votes: 0
    })

    content.reset()
    author.reset()
    info.reset()

    navigate('/')
  }

  const handleReset = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>

      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.input} />
        </div>

        <div>
          author
          <input {...author.input} />
        </div>

        <div>
          url for more info
          <input {...info.input} />
        </div>

        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  )
}

export default CreateNew