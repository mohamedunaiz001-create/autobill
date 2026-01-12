"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Admin } from "./types"

interface AuthContextType {
  admin: Admin | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)

  useEffect(() => {
    // Check for existing session
    const stored = sessionStorage.getItem("admin")
    if (stored) {
      setAdmin(JSON.parse(stored))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (data.success && data.admin) {
        setAdmin(data.admin)
        sessionStorage.setItem("admin", JSON.stringify(data.admin))
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await response.json()
      if (data.success && data.admin) {
        setAdmin(data.admin)
        sessionStorage.setItem("admin", JSON.stringify(data.admin))
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch {
      return { success: false, error: "An error occurred" }
    }
  }

  const logout = () => {
    setAdmin(null)
    sessionStorage.removeItem("admin")
  }

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated: !!admin, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
