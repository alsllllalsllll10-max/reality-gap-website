import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { saveMediaFile, loadMediaAsUrl, deleteMediaFile } from '@/lib/mediaStorage'

export type MediaKey =
  | 'heroVideo'
  | 'imgPresentation'
  | 'imgFormalVsReal'
  | 'imgStudents'
  | 'imgClassroom'
  | 'backgroundMusic'

export const STORAGE_KEYS: Record<MediaKey, string> = {
  heroVideo: 'media_hero_video',
  imgPresentation: 'media_img_presentation',
  imgFormalVsReal: 'media_img_formal_vs_real',
  imgStudents: 'media_img_students',
  imgClassroom: 'media_img_classroom',
  backgroundMusic: 'media_background_music',
}

type MediaUrls = Record<MediaKey, string | null>
type RemoteConfig = { media: Partial<MediaUrls>, texts: Record<string, string> }

interface MediaContextType {
  urls: MediaUrls
  remoteTexts: Record<string, string>
  remoteMediaUrls: Partial<MediaUrls>
  dirtyMedia: Set<MediaKey>
  isLoading: boolean
  isAccessGranted: boolean
  setIsAccessGranted: (val: boolean) => void
  updateMedia: (key: MediaKey, file: File) => Promise<string>
  resetMedia: (key: MediaKey) => Promise<void>
}

const defaultUrls: MediaUrls = {
  heroVideo: null,
  imgPresentation: null,
  imgFormalVsReal: null,
  imgStudents: null,
  imgClassroom: null,
  backgroundMusic: null,
}

const MediaContext = createContext<MediaContextType | null>(null)

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [urls, setUrls] = useState<MediaUrls>(defaultUrls)
  const [remoteTexts, setRemoteTexts] = useState<Record<string, string>>({})
  const [remoteMediaUrls, setRemoteMediaUrls] = useState<Partial<MediaUrls>>({})
  const [dirtyMedia, setDirtyMedia] = useState<Set<MediaKey>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [isAccessGranted, setIsAccessGranted] = useState(false)
  const trackedUrls = useRef<string[]>([])

  // Fetch Remote Configuration & Local IndexedDB
  useEffect(() => {
    const load = async () => {
      // 1. Fetch config from GitHub Pages
      let config: RemoteConfig = { media: {}, texts: {} }
      try {
        // Fetch from raw GitHub to bypass GitHub Actions build delay for instant updates!
        const res = await fetch(`https://raw.githubusercontent.com/alsllllalsllll10-max/reality-gap-website/main/client/public/config.json?t=${Date.now()}`)
        if (res.ok) {
          config = await res.json()
        } else {
          const fallback = await fetch(`/reality-gap-website/config.json?t=${Date.now()}`)
          if (fallback.ok) config = await fallback.json()
        }
      } catch (e) {
        try {
          const fallback = await fetch(`/reality-gap-website/config.json?t=${Date.now()}`)
          if (fallback.ok) config = await fallback.json()
        } catch (e2) {
          console.error("Could not load remote config", e2)
        }
      }

      setRemoteTexts(config.texts || {})
      setRemoteMediaUrls(config.media || {})

      // 2. Load Local Overrides
      const entries = Object.entries(STORAGE_KEYS) as [MediaKey, string][]
      const loaded: Partial<MediaUrls> = { ...config.media }

      for (const [ctxKey, storageKey] of entries) {
        const localUrl = await loadMediaAsUrl(storageKey)
        if (localUrl) {
          loaded[ctxKey] = localUrl
          trackedUrls.current.push(localUrl)
        }
      }
      
      setUrls((prev) => ({ ...prev, ...loaded }))
      setIsLoading(false)
    }
    load()
    return () => {
      trackedUrls.current.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [])

  const updateMedia = useCallback(async (key: MediaKey, file: File): Promise<string> => {
    await saveMediaFile(STORAGE_KEYS[key], file)
    const url = URL.createObjectURL(file)
    trackedUrls.current.push(url)
    setUrls((prev) => ({ ...prev, [key]: url }))
    setDirtyMedia((prev) => {
      const next = new Set(prev)
      next.add(key)
      return next
    })
    return url
  }, [])

  const resetMedia = useCallback(async (key: MediaKey): Promise<void> => {
    await deleteMediaFile(STORAGE_KEYS[key])
    setDirtyMedia((prev) => {
      const next = new Set(prev)
      next.delete(key)
      return next
    })
    // Revert to remote config if exists
    setUrls((prev) => ({ ...prev, [key]: remoteMediaUrls[key] || null }))
  }, [remoteMediaUrls])

  return (
    <MediaContext.Provider value={{ 
      urls, remoteTexts, remoteMediaUrls, dirtyMedia, isLoading, 
      isAccessGranted, setIsAccessGranted, 
      updateMedia, resetMedia 
    }}>
      {children}
    </MediaContext.Provider>
  )
}

export function useMedia(): MediaContextType {
  const ctx = useContext(MediaContext)
  if (!ctx) throw new Error('useMedia must be used inside <MediaProvider>')
  return ctx
}
