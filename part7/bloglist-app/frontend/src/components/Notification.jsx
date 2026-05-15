import { useNotification } from '../stores/notificationStore'

const Notification = () => {
  const message = useNotification()

  if (!message) {
    return null
  }

  return (
    <div className={message.type}>
      {message.text}
    </div>
  )
}

export default Notification