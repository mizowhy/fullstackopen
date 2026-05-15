import { useEffect } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'

import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Navigation from './components/Navigation'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import Users from './components/Users'
import User from './components/User'
import loginService from './services/login'

import { useBlogs, useBlogActions } from './stores/blogStore'
import { useUser, useUserActions } from './stores/userStore'
import { useNotificationActions } from './stores/notificationStore'

const BlogPage = () => {
  const { id } = useParams()
  const blogs = useBlogs()
  const user = useUser()
  const { updateBlog, removeBlog } = useBlogActions()
  const { showNotification } = useNotificationActions()
  const navigate = useNavigate()

  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return <div>loading blog...</div>
  }

  const handleUpdateBlog = async (id, blogObject) => {
    try {
      await updateBlog(id, blogObject)
    } catch {
      showNotification('liking blog failed', 'error')
    }
  }

  const handleRemoveBlog = async blog => {
    const confirmRemove = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    )

    if (!confirmRemove) {
      return
    }

    try {
      await removeBlog(blog)
      showNotification(`removed blog ${blog.title}`)
      navigate('/')
    } catch {
      showNotification('removing blog failed', 'error')
    }
  }

  return (
    <BlogView
      blog={blog}
      user={user}
      updateBlog={handleUpdateBlog}
      removeBlog={handleRemoveBlog}
    />
  )
}

const App = () => {
  const user = useUser()
  const { initializeUser, loginUser, logoutUser } = useUserActions()
  const { initializeBlogs, createBlog } = useBlogActions()
  const { showNotification } = useNotificationActions()

  const navigate = useNavigate()

  useEffect(() => {
    initializeBlogs()
  }, [initializeBlogs])

  useEffect(() => {
    initializeUser()
  }, [initializeUser])

  const handleLogin = async credentials => {
    try {
      const user = await loginService.login(credentials)

      loginUser(user)
      showNotification(`Welcome ${user.name}`)
      navigate('/')
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    logoutUser()
    showNotification('logged out')
    navigate('/')
  }

  const addBlog = async blogObject => {
    try {
      const returnedBlog = await createBlog(blogObject, user)

      showNotification(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      )

      navigate('/')
    } catch {
      showNotification('creating blog failed', 'error')
    }
  }

  return (
    <div className="app-container">
      <Navigation user={user} handleLogout={handleLogout} />

      <Notification />

      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<BlogList />} />

          <Route path="/users" element={<Users />} />

          <Route path="/users/:id" element={<User />} />

          <Route
            path="/login"
            element={<LoginForm handleLogin={handleLogin} />}
          />

          <Route
            path="/create"
            element={
              user ? (
                <BlogForm createBlog={addBlog} />
              ) : (
                <LoginForm handleLogin={handleLogin} />
              )
            }
          />

          <Route path="/blogs/:id" element={<BlogPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App