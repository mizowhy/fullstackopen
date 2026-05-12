const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  const className = message.type === 'error'
    ? 'notification error'
    : 'notification'

  return (
    <div className={className}>
      {message.text}
    </div>
  )
}

export default Notification