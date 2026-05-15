import { useField } from '../hooks'
import { useBlogActions } from '../stores/blogStore'
import { useNotificationActions } from '../stores/notificationStore'

const BlogView = ({ blog, user, updateBlog, removeBlog }) => {
  const comment = useField('text')
  const { addComment } = useBlogActions()
  const { showNotification } = useNotificationActions()

  if (!blog) {
    return null
  }

  const handleLike = () => {
    updateBlog(blog.id, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    })
  }

  const handleAddComment = async event => {
    event.preventDefault()

    try {
      await addComment(blog.id, comment.input.value)
      showNotification('comment added')
      comment.reset()
    } catch {
      showNotification('adding comment failed', 'error')
    }
  }

  const canRemove =
    user &&
    blog.user &&
    (blog.user.username === user.username || blog.user.id === user.id)

  const comments = blog.comments || []

  return (
    <div className="blog-view">
      <h2>
        {blog.title} {blog.author}
      </h2>

      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>

      <div>
        likes {blog.likes}
        <button onClick={handleLike}>like</button>
      </div>

      <div>added by {blog.user ? blog.user.name : 'unknown'}</div>

      {canRemove && (
        <button onClick={() => removeBlog(blog)}>
          remove
        </button>
      )}

      <div className="comments">
        <h3>comments</h3>

        <form onSubmit={handleAddComment}>
          <input {...comment.input} />
          <button type="submit">add comment</button>
        </form>

        <ul>
          {comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default BlogView