import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export const AUTH_TOKEN_KEY = 'linkforge_auth_token'
export const AUTH_USER_KEY = 'linkforge_auth_user'

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Adjuntar automáticamente el JWT si el usuario inició sesión
api.interceptors.request.use((config) => {
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// ─── Auth Types ─────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  email: string
  username?: string | null
  is_active: boolean
  created_at: string
}

export interface RegisterRequest {
  email: string
  password: string
  username?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  user: AuthUser
}

// ─── Types (alineados con tu backend) ───────────────────────────────────────

export interface ShortenRequest {
  target_url: string
  custom_slug?: string
  redirect_type?: '301' | '307'
  expires_at?: string | null
}

export interface ShortenResponse {
  short_url: string
  slug: string
  target_url: string
  edit_token: string
  redirect_type: string
  created_at: string
  expires_at?: string | null
  is_active: boolean
}

export interface UrlInfo extends ShortenResponse {
  clicks?: number
}

/** Respuesta de GET /api/v1/analytics/{slug} → URLStats */
export interface URLStats {
  slug?: string
  total_clicks: number
  unique_clicks?: number
  last_click?: string | null
  created_at?: string
  clicks_by_day?: { date: string; count: number }[]
  top_referrers?: { referrer: string; count: number }[]
  top_countries?: { country: string; count: number }[]
}

export type Analytics = URLStats

/** Historial de renombres de slug (SlugHistory) */
export interface SlugHistoryEntry {
  id?: string
  old_code: string
  new_code: string
  changed_at: string
}

/** Historial de cambios de destino (DestinationHistory) */
export interface DestinationHistoryEntry {
  id?: string
  old_target_url: string
  new_target_url: string
  changed_at: string
}

export interface LinkHistory {
  slug_history: SlugHistoryEntry[]
  destination_history: DestinationHistoryEntry[]
}

export interface URLListItem {
  slug: string
  short_url?: string
  target_url: string
  is_active: boolean
  redirect_type?: string
  created_at: string
  expires_at?: string | null
  total_clicks?: number
  edit_token?: string
}

export interface URLListResponse {
  items?: URLListItem[]
  urls?: URLListItem[]
  total?: number
}

// ─── Auth Endpoints ─────────────────────────────────────────────────────────

/** POST /api/v1/auth/register */
export const registerUser = async (data: RegisterRequest): Promise<TokenResponse> => {
  const res = await api.post<TokenResponse>('/api/v1/auth/register', data)
  return res.data
}

/** POST /api/v1/auth/login */
export const loginUser = async (data: LoginRequest): Promise<TokenResponse> => {
  const res = await api.post<TokenResponse>('/api/v1/auth/login', data)
  return res.data
}

/** GET /api/v1/auth/me */
export const getCurrentUser = async (): Promise<AuthUser> => {
  const res = await api.get<AuthUser>('/api/v1/auth/me')
  return res.data
}

// ─── URL Endpoints ──────────────────────────────────────────────────────────

/** POST /api/v1/urls/shorten */
export const shortenUrl = async (data: ShortenRequest): Promise<ShortenResponse> => {
  const res = await api.post<ShortenResponse>('/api/v1/urls/shorten', data)
  return res.data
}

/** GET /api/v1/urls/{slug}/info */
export const getUrlInfo = async (slug: string): Promise<UrlInfo> => {
  const res = await api.get<UrlInfo>(`/api/v1/urls/${slug}/info`)
  return res.data
}

/** GET /api/v1/urls/ — lista todos los links activos de la cuenta */
export const listUrls = async (): Promise<URLListItem[]> => {
  const res = await api.get<URLListResponse | URLListItem[]>('/api/v1/urls/')
  const data = res.data
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && 'items' in data && data.items) return data.items
  if (data && typeof data === 'object' && 'urls' in data && data.urls) return data.urls
  return []
}

export interface EditSlugResponse {
  message?: string
  old_slug?: string
  new_slug: string
  short_url: string
  slug: string
}

export interface EditDestinationResponse {
  message?: string
  slug?: string
  old_target?: string
  new_target: string
  target_url: string
}

/** PATCH /api/v1/urls/{slug}/slug */
export const updateSlug = async (
  slug: string,
  newSlug: string,
  editToken?: string
): Promise<EditSlugResponse> => {
  const res = await api.patch(`/api/v1/urls/${slug}/slug`, {
    new_slug: newSlug,
    ...(editToken ? { edit_token: editToken } : {}),
  })
  return {
    ...res.data,
    slug: res.data.new_slug || res.data.slug || newSlug,
    short_url: res.data.short_url || '',
  }
}

/** PATCH /api/v1/urls/{slug}/destination */
export const updateDestination = async (
  slug: string,
  newTargetUrl: string,
  editToken?: string
): Promise<EditDestinationResponse> => {
  const res = await api.patch(`/api/v1/urls/${slug}/destination`, {
    new_target_url: newTargetUrl,
    ...(editToken ? { edit_token: editToken } : {}),
  })
  return {
    ...res.data,
    target_url: res.data.new_target || res.data.target_url || newTargetUrl,
  }
}

/**
 * DELETE /api/v1/urls/{slug}?edit_token=...
 * (si el usuario está autenticado, edit_token es opcional)
 */
export const deleteUrl = async (slug: string, editToken?: string): Promise<void> => {
  await api.delete(`/api/v1/urls/${slug}`, {
    params: editToken ? { edit_token: editToken } : undefined,
  })
}

/** GET /api/v1/analytics/{slug} */
export const getAnalytics = async (slug: string): Promise<URLStats> => {
  const res = await api.get<URLStats>(`/api/v1/analytics/${slug}`)
  return res.data
}

/**
 * Historial combinado.
 * GET /api/v1/urls/{slug}/history
 * → { slug_history: [...], destination_history: [...] }
 */
export const getHistory = async (slug: string): Promise<LinkHistory> => {
  const empty: LinkHistory = { slug_history: [], destination_history: [] }

  try {
    const res = await api.get(`/api/v1/urls/${slug}/history`)
    const d = res.data
    return {
      slug_history: d.slug_history ?? d.slugHistory ?? [],
      destination_history: d.destination_history ?? d.destinationHistory ?? [],
    }
  } catch {
    try {
      const [slugRes, destRes] = await Promise.allSettled([
        api.get(`/api/v1/urls/${slug}/slug-history`),
        api.get(`/api/v1/urls/${slug}/destination-history`),
      ])
      return {
        slug_history:
          slugRes.status === 'fulfilled'
            ? Array.isArray(slugRes.value.data)
              ? slugRes.value.data
              : slugRes.value.data?.items ?? []
            : [],
        destination_history:
          destRes.status === 'fulfilled'
            ? Array.isArray(destRes.value.data)
              ? destRes.value.data
              : destRes.value.data?.items ?? []
            : [],
      }
    } catch {
      return empty
    }
  }
}