'use client';

import { useState, useCallback, useEffect } from 'react'

export interface AuthState {
  isAuthenticated: boolean
  userEmail: string | null
  token: string | null
}

/**
 * Custom hook for managing authentication state
 * Uses localStorage for persistence
 */
export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    userEmail: null,
    token: null,
  })

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userEmail = localStorage.getItem('userEmail')
    
    if (token && userEmail) {
      setAuth({
        isAuthenticated: true,
        userEmail,
        token,
      })
    }
  }, [])

  const login = useCallback((token: string, userEmail: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userEmail', userEmail)
    setAuth({
      isAuthenticated: true,
      userEmail,
      token,
    })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    setAuth({
      isAuthenticated: false,
      userEmail: null,
      token: null,
    })
  }, [])

  return {
    ...auth,
    login,
    logout,
  }
}
