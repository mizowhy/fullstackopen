import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const useNotificationStore = create((set, get) => ({
  notification: null,
  timeoutId: null,
  showNotification: (text, type = 'success') => {
    const oldTimeoutId = get().timeoutId

    if (oldTimeoutId) {
      clearTimeout(oldTimeoutId)
    }

    set({
      notification: { text, type }
    })

    const newTimeoutId = setTimeout(() => {
      set({
        notification: null,
        timeoutId: null
      })
    }, 5000)

    set({
      timeoutId: newTimeoutId
    })
  }
}))

export const useNotification = () =>
  useNotificationStore(state => state.notification)

export const useNotificationActions = () =>
  useNotificationStore(
    useShallow(state => ({
      showNotification: state.showNotification
    }))
  )

export default useNotificationStore