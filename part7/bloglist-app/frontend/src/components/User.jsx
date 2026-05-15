import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useUsers, useUsersActions } from '../stores/usersStore'

const User = () => {
  const { id } = useParams()
  const users = useUsers()
  const { initializeUsers } = useUsersActions()

  useEffect(() => {
    initializeUsers()
  }, [initializeUsers])

  const user = users.find(user => user.id === id)

  if (!user) {
    return <div>loading user...</div>
  }

  const blogs = user.blogs || []

  return (
    <div>
      <h2>{user.name}</h2>

      <h3>added blogs</h3>

      <ul>
        {blogs.map(blog => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default User