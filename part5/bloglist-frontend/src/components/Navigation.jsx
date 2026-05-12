import { Link } from 'react-router-dom'

const Navigation = ({ user, handleLogout }) => {
  return (
    <div className="navigation">
      <Link to="/">
        blogs
      </Link>

      {user === null ? (
        <Link to="/login">
          login
        </Link>
      ) : (
        <>
          <Link to="/create">
            create new
          </Link>

          <span className="navigation-user">
            {user.name} logged in{' '}
            <button onClick={handleLogout}>
              logout
            </button>
          </span>
        </>
      )}
    </div>
  )
}

export default Navigation