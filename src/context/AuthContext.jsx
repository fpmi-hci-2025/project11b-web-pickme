import { createContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/auth'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const userData = await authService.getCurrentUser()
      setUser(userData)
    } catch (error) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    localStorage.setItem('accessToken', data.access)
    localStorage.setItem('refreshToken', data.refresh)
    await loadUser()
  }

  const register = async (userData) => {
    const data = await authService.register(userData)
    localStorage.setItem('accessToken', data.tokens.access)
    localStorage.setItem('refreshToken', data.tokens.refresh)
    setUser(data.user)
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      await authService.logout(refreshToken)
    } catch (error) {
      // Ignore logout errors
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
