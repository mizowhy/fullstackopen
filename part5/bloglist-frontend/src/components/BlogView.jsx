const BlogView = ({ blog, user, updateBlog, removeBlog }) => {
  if (!blog) {
    return null
  }

  const handleLike = () => {
    const userId = typeof blog.user === 'object'
      ? blog.user.id
      : blog.user

    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: userId
    }

    updateBlog(blog.id, updatedBlog)
  }

  const handleRemove = () => {
    removeBlog(blog)
  }

  const showRemoveButton = user && blog.user && (
    blog.user.username === user.username ||
    blog.user.id === user.id ||
    blog.user === user.id
  )

  return (
    <div className="blog-view">
      <h2>
        {blog.title} {blog.author}
      </h2>

      <div className="blog-view-section">
        <a href={blog.url}>{blog.url}</a>
      </div>

      <div className="blog-view-section">
        likes {blog.likes}{' '}
        {user && (
          <button onClick={handleLike}>
            like
          </button>
        )}
      </div>

      <div className="blog-view-section">
        added by {blog.user && blog.user.name}
      </div>

      {showRemoveButton && (
        <button onClick={handleRemove}>
          remove
        </button>
      )}
    </div>
  )
}

export default BlogView