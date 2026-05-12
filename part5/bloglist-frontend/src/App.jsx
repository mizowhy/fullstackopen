import { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  useNavigate,
  useParams
} from 'react-router-dom'

import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Navigation from './components/Navigation'
import blogService from './services/blogs'
import loginService from './services/login'

const BlogPage = ({ blogs, user, updateBlog, removeBlog }) => {
  const { id } = useParams()
  const blog = blogs.find(blog => blog.id === id)

  return (
    <BlogView
      blog={blog}
      user={user}
      updateBlog={updateBlog}
      removeBlog={removeBlog}
    />
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (text, type = 'success') => {
    setNotification({ text, type })

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem(
        'loggedBlogAppUser',
        JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification(`Welcome ${user.name}`)
      navigate('/')
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    blogService.setToken(null)
    showNotification('logged out')
    navigate('/')
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      const blogWithUser = {
        ...returnedBlog,
        user: {
          username: user.username,
          name: user.name,
          id: user.id
        }
      }

      const updatedBlogs = blogs
        .concat(blogWithUser)
        .sort((a, b) => b.likes - a.likes)

      setBlogs(updatedBlogs)

      showNotification(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      )

      navigate('/')
    } catch {
      showNotification('creating blog failed', 'error')
    }
  }

  const updateBlog = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)

      const originalBlog = blogs.find(blog => blog.id === id)

      const blogWithUser = {
        ...returnedBlog,
        user: originalBlog.user
      }

      const updatedBlogs = blogs
        .map(blog => blog.id !== id ? blog : blogWithUser)
        .sort((a, b) => b.likes - a.likes)

      setBlogs(updatedBlogs)
    } catch {
      showNotification('liking blog failed', 'error')
    }
  }

  const removeBlog = async (blog) => {
    const confirmRemove = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    )

    if (!confirmRemove) {
      return
    }

    try {
      await blogService.remove(blog.id)

      setBlogs(blogs.filter(b => b.id !== blog.id))
      showNotification(`removed blog ${blog.title}`)
      navigate('/')
    } catch {
      showNotification('removing blog failed', 'error')
    }
  }

  return (
    <div className="app-container">
      <Navigation user={user} handleLogout={handleLogout} />

      <Notification message={notification} />

      <Routes>
        <Route
          path="/"
          element={<BlogList blogs={blogs} />}
        />

        <Route
          path="/login"
          element={
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleLogin={handleLogin}
            />
          }
        />

        <Route
          path="/create"
          element={
            user
              ? <BlogForm createBlog={addBlog} />
              : <LoginForm
                username={username}
                password={password}
                handleUsernameChange={({ target }) => setUsername(target.value)}
                handlePasswordChange={({ target }) => setPassword(target.value)}
                handleLogin={handleLogin}
              />
          }
        />

        <Route
          path="/blogs/:id"
          element={
            <BlogPage
              blogs={blogs}
              user={user}
              updateBlog={updateBlog}
              removeBlog={removeBlog}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App