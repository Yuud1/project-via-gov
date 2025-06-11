import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserType = "admin" | "driver" | null

interface User {
  id: string
  name: string
  email: string
  type: UserType
}

interface AuthContextType {
  user: User | null
  userType: UserType
  isAuthenticated: boolean
  isLoading: boolean
  login: (type: UserType, userData?: Partial<User>) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há dados de autenticação salvos
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem("authData")
        if (authData) {
          const userData = JSON.parse(authData)
          setUser(userData)
        }
      } catch (error) {
        console.error("Erro ao carregar dados de autenticação:", error)
        localStorage.removeItem("authData")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = (type: UserType, userData?: Partial<User>) => {
    const newUser: User = {
      id: userData?.id || `${type}-${Date.now()}`,
      name: userData?.name || (type === "admin" ? "Administrador" : "Motorista"),
      email: userData?.email || `${type}@empresa.com`,
      type,
    }

    setUser(newUser)
    localStorage.setItem("authData", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("authData")
  }

  const value: AuthContextType = {
    user,
    userType: user?.type || null,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
