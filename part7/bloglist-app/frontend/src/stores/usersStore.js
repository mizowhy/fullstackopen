import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import usersService from '../services/users'

const useUsersStore = create(set => ({
  users: [],
  initializeUsers: async () => {
    const users = await usersService.getAll()
    set({ users })
  }
}))

export const useUsers = () => useUsersStore(state => state.users)

export const useUsersActions = () =>
  useUsersStore(
    useShallow(state => ({
      initializeUsers: state.initializeUsers
    }))
  )

export default useUsersStore