import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import blogService from '../services/blogs'
import persistentUser from '../services/persistentUser'

const useUserStore = create(set => ({
  user: null,
  initializeUser: () => {
    const user = persistentUser.getUser()

    if (user) {
      blogService.setToken(user.token)
      set({ user })
    }
  },
  loginUser: user => {
    persistentUser.saveUser(user)
    blogService.setToken(user.token)
    set({ user })
  },
  logoutUser: () => {
    persistentUser.removeUser()
    blogService.setToken(null)
    set({ user: null })
  }
}))

export const useUser = () => useUserStore(state => state.user)

export const useUserActions = () =>
  useUserStore(
    useShallow(state => ({
      initializeUser: state.initializeUser,
      loginUser: state.loginUser,
      logoutUser: state.logoutUser
    }))
  )

export default useUserStore