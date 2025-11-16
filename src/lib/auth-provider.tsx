'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { AuthResponse } from '@/types/auth'

interface AuthContextType {
  user: AuthResponse['user'] | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<AuthResponse['user'] | void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include' // Important for sending cookies
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch user: ${res.status}`);
        }

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Invalid content type:', contentType);
          throw new Error('Invalid response format');
        }

        const data = await res.json();
        console.log('Auth check response:', data);
        
        if (isMounted) {
          setUser(data.user || null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [])

  const signIn = async (email: string, password: string) => {
    setError(null) // Clear any previous errors
    try {
      console.log('Attempting to sign in with:', email);
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', Object.fromEntries(res.headers.entries()));

      if (!res.ok) {
        console.log('Response not OK, status:', res.status);
        const contentType = res.headers.get('content-type');
        console.log('Content type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          console.log('Error response data:', data);
          throw new Error(data.error || 'Failed to sign in');
        } else {
          // Get the response text to see what's actually being returned
          const text = await res.text();
          console.log('Non-JSON response text:', text);
          throw new Error(`Server error: ${res.status} - ${text.substring(0, 100)}`);
        }
      }

      const data = await res.json();
      console.log('Sign in successful, user data:', data);
      setUser(data.user);
      
      // Return the user data to allow the signin page to handle redirects
      return data.user;
    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
      setError(errorMessage);
      throw error;
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Failed to sign up')
    }
  }

  const signOut = async () => {
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include' // Ensure cookies are sent
      })

      if (!res.ok) {
        throw new Error('Failed to sign out')
      }

      // Clear user state
      setUser(null)
      
      // Clear any stored data
      if (typeof window !== 'undefined') {
        // Clear cart from localStorage
        localStorage.removeItem('cart-storage')
        
        // Clear any other auth-related data
        localStorage.clear()
        sessionStorage.clear()
        
        console.log('User signed out and all data cleared')
      }
    } catch (error) {
      console.error('Sign out error:', error)
      // Even if the API fails, clear local state
      setUser(null)
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
      throw error
    }
  }

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut, refreshUser, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
