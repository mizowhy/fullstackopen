import { Link } from 'react-router-dom'
import { useBlogs } from '../stores/blogStore'

const BlogList = () => {
  const blogs = useBlogs()

  return (
    <div>
      {blogs.map(blog => (
        <div key={blog.id} className="blog">
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} {blog.author}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default BlogList