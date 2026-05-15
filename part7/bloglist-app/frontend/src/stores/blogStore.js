import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import blogService from '../services/blogs'

const sortByLikes = blogs => blogs.toSorted((a, b) => b.likes - a.likes)

const useBlogStore = create((set, get) => ({
  blogs: [],
  initializeBlogs: async () => {
    const blogs = await blogService.getAll()

    set({
      blogs: sortByLikes(blogs)
    })
  },
  createBlog: async (blogObject, user) => {
    const returnedBlog = await blogService.create(blogObject)

    const blogWithUser = {
      ...returnedBlog,
      user: {
        username: user.username,
        name: user.name,
        id: user.id
      }
    }

    set(state => ({
      blogs: sortByLikes(state.blogs.concat(blogWithUser))
    }))

    return returnedBlog
  },
  updateBlog: async (id, blogObject) => {
    const returnedBlog = await blogService.update(id, blogObject)
    const originalBlog = get().blogs.find(blog => blog.id === id)

    const blogWithUser = {
      ...returnedBlog,
      user: originalBlog.user
    }

    set(state => ({
      blogs: sortByLikes(
        state.blogs.map(blog => (blog.id !== id ? blog : blogWithUser))
      )
    }))
  },
  removeBlog: async blog => {
    await blogService.remove(blog.id)

    set(state => ({
      blogs: state.blogs.filter(b => b.id !== blog.id)
    }))
  },
  addComment: async (id, comment) => {
    const returnedBlog = await blogService.addComment(id, comment)
    const originalBlog = get().blogs.find(blog => blog.id === id)

    const blogWithUser = {
      ...returnedBlog,
      user: originalBlog.user
    }

    set(state => ({
      blogs: state.blogs.map(blog =>
        blog.id !== id ? blog : blogWithUser
      )
    }))

    return returnedBlog
  }
}))

export const useBlogs = () => useBlogStore(state => state.blogs)

export const useBlogActions = () =>
  useBlogStore(
    useShallow(state => ({
      initializeBlogs: state.initializeBlogs,
      createBlog: state.createBlog,
      updateBlog: state.updateBlog,
      removeBlog: state.removeBlog,
      addComment: state.addComment
    }))
  )

export default useBlogStore