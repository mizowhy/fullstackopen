const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) =>
    blog.likes > favorite.likes ? blog : favorite
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authors = _.countBy(blogs, 'author')
  const topAuthor = _.maxBy(Object.keys(authors), author => authors[author])

  return {
    author: topAuthor,
    blogs: authors[topAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likesByAuthor = _.groupBy(blogs, 'author')
  const authors = Object.keys(likesByAuthor)

  const authorLikes = authors.map(author => ({
    author,
    likes: _.sumBy(likesByAuthor[author], 'likes')
  }))

  return _.maxBy(authorLikes, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}