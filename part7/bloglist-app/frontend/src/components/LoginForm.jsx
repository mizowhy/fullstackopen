import { useField } from '../hooks'

const LoginForm = ({ handleLogin }) => {
  const username = useField('text')
  const password = useField('password')

  const onSubmit = async event => {
    event.preventDefault()

    await handleLogin({
      username: username.input.value,
      password: password.input.value
    })

    username.reset()
    password.reset()
  }

  return (
    <div className="form-card">
      <h2>login</h2>

      <form onSubmit={onSubmit}>
        <div>
          username
          <input {...username.input} />
        </div>

        <div>
          password
          <input {...password.input} />
        </div>

        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm