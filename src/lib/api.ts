import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface ShortenRequest {
  target_url: string
  custom_slug?: string
}

export interface ShortenResponse {
  short_url: string
  slug: string
  target_url: string
  edit_token: string
  redirect_type: string
  created_at: string
  is_active: boolean
}

export interface UrlInfo {
  short_url: string
  slug: string
  target_url: string
  redirect_type: string
  created_at: string
  is_active: boolean
  clicks?: number
}

export interface Analytics {
  slug: string
  total_clicks: number
  unique_clicks?: number
  clicks_by_day?: { date: string; count: number }[]
  recent_clicks?: { timestamp: string; referer?: string; country?: string }[]
}

export const shortenUrl = async (data: ShortenRequest): Promise<ShortenResponse> => {
  const res = await api.post<ShortenResponse>('/api/v1/urls/shorten', data)
  return res.data
}

export const getUrlInfo = async (slug: string): Promise<UrlInfo> => {
  const res = await api.get<UrlInfo>(`/api/v1/urls/${slug}/info`)
  return res.data
}

export const updateSlug = async (
  slug: string,
  newSlug: string,
  editToken: string
): Promise<ShortenResponse> => {
  const res = await api.patch<ShortenResponse>(`/api/v1/urls/${slug}/slug`, {
    new_slug: newSlug,
    edit_token: editToken,
  })
  return res.data
}

export const updateDestination = async (
  slug: string,
  newTargetUrl: string,
  editToken: string
): Promise<ShortenResponse> => {
  const res = await api.patch<ShortenResponse>(`/api/v1/urls/${slug}/destination`, {
    new_target_url: newTargetUrl,
    edit_token: editToken,
  })
  return res.data
}

export const deleteUrl = async (slug: string, editToken: string): Promise<void> => {
  await api.delete(`/api/v1/urls/${slug}`, {
    data: { edit_token: editToken },
  })
}

export const getAnalytics = async (slug: string): Promise<Analytics> => {
  const res = await api.get<Analytics>(`/api/v1/analytics/${slug}`)
  return res.data
}
