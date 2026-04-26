const DB_NAME = 'RealityGapMediaDB'
const DB_VERSION = 1
const STORE_NAME = 'files'

let _db: IDBDatabase | null = null

async function getDB(): Promise<IDBDatabase> {
  if (_db) return _db
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => {
      _db = req.result
      resolve(_db!)
    }
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

/** Save a File or Blob to IndexedDB under the given key */
export async function saveMediaFile(key: string, file: File | Blob): Promise<void> {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req = store.put(file, key)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => resolve()
  })
}

/** Load a file from IndexedDB and return a Blob URL, or null if not found */
export async function loadMediaAsUrl(key: string): Promise<string | null> {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const req = store.get(key)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => {
      const result = req.result as Blob | undefined
      if (result) {
        resolve(URL.createObjectURL(result))
      } else {
        resolve(null)
      }
    }
  })
}

/** Delete a file from IndexedDB */
export async function deleteMediaFile(key: string): Promise<void> {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req = store.delete(key)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => resolve()
  })
}
