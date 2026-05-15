import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification, setNotification] = useState(null)
  const [timeoutId, setTimeoutId] = useState(null)

  const notify = (message, type = 'success') => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    setNotification({
      message,
      type
    })

    const newTimeoutId = setTimeout(() => {
      setNotification(null)
      setTimeoutId(null)
    }, 5000)

    setTimeoutId(newTimeoutId)
  }

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotify = () => {
  const { notify } = useContext(NotificationContext)
  return notify
}

export const useNotification = () => {
  const { notification } = useContext(NotificationContext)
  return notification
}

export default NotificationContext