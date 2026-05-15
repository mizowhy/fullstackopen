import { Link } from 'react-router-dom'

const Navigation = ({ user, handleLogout }) => {
  return (
    <div className="navigation">
      <Link to="/">blogs</Link>
      <Link to="/users">users</Link>

      {user ? (
        <>
          <Link to="/create">create</Link>

          <span className="navigation-user">
            {user.name} logged in
          </span>

          <button onClick={handleLogout}>
            logout
          </button>
        </>
      ) : (
        <Link className="navigation-user" to="/login">
          login
        </Link>
      )}
    </div>
  )
}

export default Navigation