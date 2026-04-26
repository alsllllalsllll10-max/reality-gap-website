import { useState, useEffect, useCallback } from 'react'

// Shared state management using IndexedDB for cross-tab/cross-window synchronization
const DB_NAME = 'RealityGapDB'
const STORE_NAME = 'SharedState'

interface SharedStateData {
  mediaItems: any[]
  musicUrl: string
  volume: number
  timestamp: number
}

let db: IDBDatabase | null = null

const initDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }
    
    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

const saveToSharedDB = async (key: string, data: any) => {
  try {
    if (!db) await initDB()
    const transaction = db!.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    store.put({
      id: key,
      data,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Error saving to shared DB:', error)
  }
}

const loadFromSharedDB = async (key: string): Promise<any> => {
  try {
    if (!db) await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(key)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        resolve(request.result?.data || null)
      }
    })
  } catch (error) {
    console.error('Error loading from shared DB:', error)
    return null
  }
}

export const useSharedState = <T,>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [state, setState] = useState<T>(initialValue)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from shared DB on mount
  useEffect(() => {
    const loadState = async () => {
      const saved = await loadFromSharedDB(key)
      // Always use initialValue if it's different from saved (for volume, use 0.9)
      if (key === 'volume' && initialValue === 0.9) {
        // For volume, always use 0.9 as default
        await saveToSharedDB(key, 0.9)
        setState(0.9 as any)
      } else if (saved !== null) {
        setState(saved)
      } else {
        // Save initial value if not already saved
        await saveToSharedDB(key, initialValue)
        setState(initialValue)
      }
      setIsInitialized(true)
    }
    loadState()
  }, [key, initialValue])

  // Listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === `shared_${key}` && event.newValue) {
        try {
          setState(JSON.parse(event.newValue))
        } catch (error) {
          console.error('Error parsing storage event:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  const updateState = useCallback((newValue: T) => {
    setState(newValue)
    saveToSharedDB(key, newValue)
    // Broadcast to other tabs
    localStorage.setItem(`shared_${key}`, JSON.stringify(newValue))
  }, [key])

  return [state, updateState]
}
