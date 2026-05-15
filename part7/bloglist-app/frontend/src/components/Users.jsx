import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUsers, useUsersActions } from '../stores/usersStore'

const Users = () => {
  const users = useUsers()
  const { initializeUsers } = useUsersActions()

  useEffect(() => {
    initializeUsers()
  }, [initializeUsers])

  return (
    <div>
      <h2>Users</h2>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs ? user.blogs.length : 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users