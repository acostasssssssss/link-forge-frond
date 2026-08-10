import { useState, useEffect, useCallback } from 'react'
import type { ShortenResponse, URLListItem } from '../lib/api'
import { listUrls } from '../lib/api'

const STORAGE_KEY = 'linkforge_links'
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function listItemToResponse(item: URLListItem): ShortenResponse {
  const token =
    item.edit_token ||
    localStorage.getItem(`linkforge_token_${item.slug}`) ||
    ''
  return {
    short_url: item.short_url || `${BASE}/${item.slug}`,
    slug: item.slug,
    target_url: item.target_url,
    edit_token: token,
    redirect_type: item.redirect_type || '307',
    created_at: item.created_at,
    expires_at: item.expires_at,
    is_active: item.is_active,
  }
}

export function useLocalLinks() {
  const [links, setLinks] = useState<ShortenResponse[]>([])
  const [loadingList, setLoadingList] = useState(true)

  // Cargar desde API + localStorage
  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoadingList(true)
      let local: ShortenResponse[] = []
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) local = JSON.parse(raw)
      } catch {
        /* ignore */
      }

      try {
        const remote = await listUrls()
        if (cancelled) return
        const mapped = remote.map(listItemToResponse)
        // Merge: remote primero, conservar tokens locales
        const bySlug = new Map<string, ShortenResponse>()
        for (const l of local) bySlug.set(l.slug, l)
        for (const r of mapped) {
          const prev = bySlug.get(r.slug)
          bySlug.set(r.slug, {
            ...r,
            edit_token: r.edit_token || prev?.edit_token || '',
          })
        }
        const merged = Array.from(bySlug.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        setLinks(merged)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      } catch {
        if (!cancelled) setLinks(local)
      } finally {
        if (!cancelled) setLoadingList(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const save = useCallback((next: ShortenResponse[]) => {
    setLinks(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const addLink = useCallback(
    (link: ShortenResponse) => {
      const next = [link, ...links.filter((l) => l.slug !== link.slug)]
      save(next)
      if (link.edit_token) {
        localStorage.setItem(`linkforge_token_${link.slug}`, link.edit_token)
      }
    },
    [links, save]
  )

  const updateLink = useCallback(
    (oldSlug: string, link: ShortenResponse) => {
      const next = links.map((l) => (l.slug === oldSlug ? link : l))
      save(next)
      if (link.edit_token) {
        localStorage.setItem(`linkforge_token_${link.slug}`, link.edit_token)
      }
      if (oldSlug !== link.slug) {
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
