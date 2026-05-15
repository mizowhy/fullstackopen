import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from 'react-router-dom'

import AnecdoteList from './components/AnecdoteList'
import CreateNew from './components/CreateNew'
import About from './components/About'
import Footer from './components/Footer'
import { useAnecdotes } from './hooks'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }

  return (
    <div>
      <Link style={padding} to="/">
        anecdotes
      </Link>
      <Link style={padding} to="/create">
        create new
      </Link>
      <Link style={padding} to="/about">
        about
      </Link>
    </div>
  )
}

const Anecdote = () => {
  const { anecdotes } = useAnecdotes()
  const id = useParams().id

  const anecdote = anecdotes.find(anecdote => anecdote.id === id)

  if (!anecdote) {
    return null
  }

  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <div>has {anecdote.votes} votes</div>
      <div>
        for more info see <a href={anecdote.info}>{anecdote.info}</a>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>

        <Menu />

        <Routes>
          <Route path="/" element={<AnecdoteList />} />
          <Route path="/anecdotes/:id" element={<Anecdote />} />
          <Route path="/create" element={<CreateNew />} />
          <Route path="/about" element={<About />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  )
}

export default App