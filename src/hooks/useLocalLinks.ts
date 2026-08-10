import { useState, useEffect, useCallback } from 'react'
import type { ShortenResponse } from '../lib/api'

const STORAGE_KEY = 'linkforge_links'
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

/** Normaliza un link guardado para que siempre tenga los campos mínimos */
function normalize(raw: Partial<ShortenResponse> & { code?: string }): ShortenResponse | null {
  const slug = raw.slug || raw.code
  if (!slug) return null

  const token =
    raw.edit_token ||
    (typeof localStorage !== 'undefined'
      ? localStorage.getItem(`linkforge_token_${slug}`) || ''
      : '')

  return {
    short_url: raw.short_url || `${BASE}/${slug}`,
    slug,
    target_url: raw.target_url || '',
    edit_token: token,
    redirect_type: raw.redirect_type || '307',
    created_at: raw.created_at || new Date().toISOString(),
    expires_at: raw.expires_at ?? null,
    is_active: raw.is_active !== false,
  }
}

/** Solo links de ESTE navegador (privacidad sin login) */
export function useLocalLinks() {
  const [links, setLinks] = useState<ShortenResponse[]>([])
  const [loadingList, setLoadingList] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as unknown[]
        const normalized = (Array.isArray(parsed) ? parsed : [])
          .map((item) => normalize(item as Partial<ShortenResponse>))
          .filter((x): x is ShortenResponse => x !== null)
        setLinks(normalized)
        // Re-guardar normalizado para próximas cargas
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
      }
    } catch {
      /* ignore */
    } finally {
      setLoadingList(false)
    }
  }, [])

  const save = useCallback((next: ShortenResponse[]) => {
    setLinks(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const addLink = useCallback(
    (link: ShortenResponse) => {
      const normalized = normalize(link)
      if (!normalized) return
      const next = [normalized, ...links.filter((l) => l.slug !== normalized.slug)]
      save(next)
      if (normalized.edit_token) {
        localStorage.setItem(`linkforge_token_${normalized.slug}`, normalized.edit_token)
      }
    },
    [links, save]
  )

  const updateLink = useCallback(
    (oldSlug: string, link: ShortenResponse) => {
      const normalized = normalize(link) || link
      const next = links.map((l) => (l.slug === oldSlug ? normalized : l))
      save(next)
      if (normalized.edit_token) {
        localStorage.setItem(`linkforge_token_${normalized.slug}`, normalized.edit_token)
      }
      if (oldSlug !== normalized.slug) {
        localStorage.removeItem(`linkforge_token_${oldSlug}`)
      }
    },
    [links, save]
  )

  const removeLink = useCallback(
    (slug: string) => {
      save(links.filter((l) => l.slug !== slug))
      localStorage.removeItem(`linkforge_token_${slug}`)
    },
    [links, save]
  )

  const getToken = useCallback((slug: string) => {
    return localStorage.getItem(`linkforge_token_${slug}`) || ''
  }, [])

  return { links, addLink, updateLink, removeLink, getToken, loadingList }
}
