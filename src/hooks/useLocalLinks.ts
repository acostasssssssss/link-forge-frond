import { useState, useEffect, useCallback } from 'react'
import type { ShortenResponse } from '../lib/api'

const STORAGE_KEY = 'linkforge_links'

export function useLocalLinks() {
  const [links, setLinks] = useState<ShortenResponse[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setLinks(JSON.parse(raw))
    } catch {
      // ignore
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
      localStorage.setItem(`linkforge_token_${link.slug}`, link.edit_token)
    },
    [links, save]
  )

  const updateLink = useCallback(
    (oldSlug: string, link: ShortenResponse) => {
      const next = links.map((l) => (l.slug === oldSlug ? link : l))
      save(next)
      localStorage.setItem(`linkforge_token_${link.slug}`, link.edit_token)
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

  return { links, addLink, updateLink, removeLink, getToken }
}
