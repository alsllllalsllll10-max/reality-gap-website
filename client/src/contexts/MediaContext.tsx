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
  const [isLoading, setIsLoading] = useState(true)
  const [isAccessGranted, setIsAccessGranted] = useState(false)
  const trackedUrls = useRef<string[]>([])

  // Fetch Remote Configuration & Local IndexedDB
  useEffect(() => {
    const load = async () => {
      // 1. Fetch config from GitHub Pages
      let config: RemoteConfig = { media: {}, texts: {} }
      try {
        const res = await fetch(`/reality-gap-website/config.json?t=${Date.now()}`)
        if (res.ok) {
          config = await res.json()
        }
      } catch (e) { console.error("Could not load remote config", e) }

      setRemoteTexts(config.texts || {})

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
    return url
  }, [])

  const resetMedia = useCallback(async (key: MediaKey): Promise<void> => {
    await deleteMediaFile(STORAGE_KEYS[key])
    // Revert to remote config if exists
    try {
      const res = await fetch(`/reality-gap-website/config.json?t=${Date.now()}`)
      if (res.ok) {
        const config: RemoteConfig = await res.json()
        setUrls((prev) => ({ ...prev, [key]: config.media[key] || null }))
      } else {
        setUrls((prev) => ({ ...prev, [key]: null }))
      }
    } catch {
      setUrls((prev) => ({ ...prev, [key]: null }))
    }
  }, [])

  return (
    <MediaContext.Provider value={{ 
      urls, remoteTexts, isLoading, 
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
