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

interface MediaContextType {
  urls: MediaUrls
  isLoading: boolean
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
  const [isLoading, setIsLoading] = useState(true)
  const trackedUrls = useRef<string[]>([])

  // Load all saved media from IndexedDB on startup
  useEffect(() => {
    const load = async () => {
      const entries = Object.entries(STORAGE_KEYS) as [MediaKey, string][]
      const loaded: Partial<MediaUrls> = {}
      for (const [ctxKey, storageKey] of entries) {
        const url = await loadMediaAsUrl(storageKey)
        if (url) {
          loaded[ctxKey] = url
          trackedUrls.current.push(url)
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

  /** Save file to IndexedDB, update context, return blob URL */
  const updateMedia = useCallback(async (key: MediaKey, file: File): Promise<string> => {
    await saveMediaFile(STORAGE_KEYS[key], file)
    const url = URL.createObjectURL(file)
    trackedUrls.current.push(url)
    setUrls((prev) => ({ ...prev, [key]: url }))
    return url
  }, [])

  /** Delete file from IndexedDB and clear from context */
  const resetMedia = useCallback(async (key: MediaKey): Promise<void> => {
    await deleteMediaFile(STORAGE_KEYS[key])
    setUrls((prev) => ({ ...prev, [key]: null }))
  }, [])

  return (
    <MediaContext.Provider value={{ urls, isLoading, updateMedia, resetMedia }}>
      {children}
    </MediaContext.Provider>
  )
}

export function useMedia(): MediaContextType {
  const ctx = useContext(MediaContext)
  if (!ctx) throw new Error('useMedia must be used inside <MediaProvider>')
  return ctx
}
