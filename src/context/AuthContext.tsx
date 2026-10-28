import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  loginUser,
  registerUser,
  getCurrentUser,
  type AuthUser,
  type LoginRequest,
  type RegisterRequest,
} from '../lib/api'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  loadingAuth: boolean
  login: (data: LoginRequest) => Promise<AuthUser>
  register: (data: RegisterRequest) => Promise<AuthUser>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof localStorage === 'undefined') return null
    return localStorage.getItem(AUTH_TOKEN_KEY)
  })

  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof localStorage === 'undefined') return null
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY)
      return raw ? (JSON.parse(raw) as AuthUser) : null
    } catch {
      return null
    }
  })

  const [loadingAuth, setLoadingAuth] = useState<boolean>(!!token)

  const clearSession = useCallback(() => {
    setToken(null)
    setUser(null)
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
    }
  }, [])

  useEffect(() => {
    if (!token) {
      setLoadingAuth(false)
      return
    }

    let cancelled = false
    getCurrentUser()
      .then((freshUser) => {
        if (cancelled) return
        setUser(freshUser)
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(freshUser))
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const status = (err as { response?: { status?: number } })?.response?.status
        if (status === 401 || status === 403) {
          clearSession()
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingAuth(false)
      })

    return () => {
      cancelled = true
    }
  }, [token, clearSession])

  const login = useCallback(async (data: LoginRequest): Promise<AuthUser> => {
    const res = await loginUser(data)
    setToken(res.access_token)
    setUser(res.user)
    localStorage.setItem(AUTH_TOKEN_KEY, res.access_token)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user))
    return res.user
  }, [])

  const register = useCallback(async (data: RegisterRequest): Promise<AuthUser> => {
    const res = await registerUser(data)
    setToken(res.access_token)
    setUser(res.user)
    localStorage.setItem(AUTH_TOKEN_KEY, res.access_token)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user))
    return res.user
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loadingAuth,
        login,
        register,
        logout: clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider')
  }
  return ctx
}