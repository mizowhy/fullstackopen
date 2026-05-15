import { useField } from '../hooks'

const BlogForm = ({ createBlog }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const addBlog = async event => {
    event.preventDefault()

    await createBlog({
      title: title.input.value,
      author: author.input.value,
      url: url.input.value
    })

    title.reset()
    author.reset()
    url.reset()
  }

  return (
    <div className="form-card">
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          title
          <input {...title.input} />
        </div>

        <div>
          author
          <input {...author.input} />
        </div>

        <div>
          url
          <input {...url.input} />
        </div>

        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm