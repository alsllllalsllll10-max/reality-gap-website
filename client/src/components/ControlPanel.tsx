'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, X, Lock, Music, Image, Video,
  Upload, Save, RotateCcw, QrCode, FileVideo,
} from 'lucide-react'
import { useSharedState } from '../hooks/useSharedState'
import { useMedia, MediaKey } from '../contexts/MediaContext'

interface ControlPanelProps {
  isAccessGranted: boolean
  setIsAccessGranted: (granted: boolean) => void
  backgroundMusic: HTMLAudioElement | null
  setBackgroundMusic: (audio: HTMLAudioElement | null) => void
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  volume: number
  setVolume: (volume: number) => void
}

interface MediaItem {
  id: MediaKey
  type: 'video' | 'image'
  name: string
  section: string
  accept: string
}

const MEDIA_ITEMS: MediaItem[] = [
  { id: 'heroVideo',       type: 'video', name: 'Hero Video',           section: 'Hero',     accept: 'video/*' },
  { id: 'imgPresentation', type: 'image', name: 'Research Presentation', section: 'Evidence', accept: 'image/*' },
  { id: 'imgFormalVsReal', type: 'image', name: 'Formal vs Real English', section: 'Evidence', accept: 'image/*' },
  { id: 'imgStudents',     type: 'image', name: 'Student Cohort',        section: 'Evidence', accept: 'image/*' },
  { id: 'imgClassroom',    type: 'image', name: 'Classroom Session',     section: 'Evidence', accept: 'image/*' },
]

export default function ControlPanel({
  isAccessGranted,
  setIsAccessGranted,
  backgroundMusic,
  setBackgroundMusic,
  isPlaying,
  setIsPlaying,
  volume,
  setVolume,
}: ControlPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [accessAttempt, setAccessAttempt] = useState('')
  const [showQRCode, setShowQRCode] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const [isSavingGlobal, setIsSavingGlobal] = useState(false)
  
  // Use a ref to access the password without triggering re-renders
  const passwordRef = useRef(accessAttempt)
  useEffect(() => {
    passwordRef.current = accessAttempt
  }, [accessAttempt])

  const { urls, updateMedia, resetMedia } = useMedia()
  const [sharedVolume, setSharedVolume] = useSharedState('volume', 0.9)

  const mediaInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const musicInputRef = useRef<HTMLInputElement | null>(null)

  // ── Access control ──────────────────────────────────────────────
  const handleAccessCode = () => {
    if (accessAttempt === '077alsomry077m') {
      setIsAccessGranted(true)
      setAccessAttempt('')
    } else {
      alert('Invalid access code')
      setAccessAttempt('')
    }
  }

  // ── Volume ──────────────────────────────────────────────────────
  const handleVolumeChange = (v: number) => {
    setVolume(v)
    setSharedVolume(v)
    if (backgroundMusic) backgroundMusic.volume = v
  }

  const toggleMusic = () => {
    if (!backgroundMusic) return
    if (isPlaying) { backgroundMusic.pause() } else { backgroundMusic.play() }
    setIsPlaying(!isPlaying)
  }

  // ── Music upload (audio file OR video → extract audio) ──────────
  const handleMusicUpload = async (file: File) => {
    setUploading('backgroundMusic')
    try {
      const url = await updateMedia('backgroundMusic', file)
      // Swap background music player
      if (backgroundMusic) backgroundMusic.pause()
      const newAudio = new Audio(url)
      newAudio.loop = true
      newAudio.volume = volume
      await newAudio.play().catch(() => {})
      setBackgroundMusic(newAudio)
      setIsPlaying(true)
      showSuccess('backgroundMusic')
    } finally {
      setUploading(null)
    }
  }

  // ── Media (image / video) upload ────────────────────────────────
  const handleMediaUpload = async (key: MediaKey, file: File) => {
    setUploading(key)
    try {
      await updateMedia(key, file)
      showSuccess(key)
    } finally {
      setUploading(null)
    }
  }

  const showSuccess = (key: string) => {
    setUploadSuccess(key)
    setTimeout(() => setUploadSuccess(null), 2500)
  }

  // ── Global Sync (Cloud Save) ────────────────────────────────────
  const handleGlobalSync = async () => {
    if (!confirm('Are you sure you want to publish these changes globally? Everyone visiting the site will see them.')) return
    
    setIsSavingGlobal(true)
    try {
      // Lazy import the sync logic to keep initial bundle small
      const { uploadToGithub, unlockToken, blobToBase64 } = await import('../lib/githubSync')
      const token = unlockToken('077alsomry077m') // Use hardcoded correct password for the actual sync
      
      if (!token) {
        alert('Authentication error. The system cannot verify your credentials.')
        setIsSavingGlobal(false)
        return
      }

      const mediaObj: Record<string, string> = {}
      
      // Collect all local texts (stored in localStorage by EditableComment)
      const textsObj: Record<string, string> = {}
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && k.startsWith('rg_comment_')) {
          textsObj[k] = localStorage.getItem(k) || ''
        }
      }

      // Collect local media urls and convert to Base64
      for (const item of MEDIA_ITEMS) {
        if (urls[item.id] && urls[item.id]!.startsWith('blob:')) {
          const res = await fetch(urls[item.id]!)
          const blob = await res.blob()
          const b64 = await blobToBase64(blob)
          // We embed small media as base64 data URIs directly to avoid complex file management
          // For videos, this creates a data URI string. 
          const mime = item.type === 'video' ? 'video/mp4' : 'image/jpeg'
          mediaObj[item.id] = `data:${mime};base64,${b64}`
        }
      }
      
      // Same for background music
      if (urls.backgroundMusic && urls.backgroundMusic.startsWith('blob:')) {
        const res = await fetch(urls.backgroundMusic)
        const blob = await res.blob()
        const b64 = await blobToBase64(blob)
        mediaObj.backgroundMusic = `data:audio/mp3;base64,${b64}`
      }

      // Merge and save
      const finalConfig = { media: mediaObj, texts: textsObj }
      const finalConfigBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(finalConfig, null, 2))))
      
      const success = await uploadToGithub(
        'client/public/config.json', 
        finalConfigBase64, 
        'Update site configuration via Control Panel', 
        token
      )

      if (success) {
        alert('تم حفظ التغييرات بنجاح ونشرها للجميع! سيتم إغلاق لوحة التحكم الآن.')
        // Complete logout
        setAccessAttempt('')
        passwordRef.current = ''
        setIsAccessGranted(false)
        setIsOpen(false)
      } else {
        alert('حدث خطأ أثناء الرفع إلى الخادم السحابي. يرجى المحاولة مرة أخرى.')
      }

    } catch (e) {
      console.error(e)
      alert('حدث خطأ غير متوقع.')
    } finally {
      setIsSavingGlobal(false)
    }
  }

  // ── Not yet authenticated ────────────────────────────────────────
  if (!isAccessGranted) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed right-4 top-4 z-50"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-[#7EC8E3]/10 border border-[#7EC8E3]/20 flex items-center justify-center hover:bg-[#7EC8E3]/20 transition-colors"
        >
          <Settings className="w-5 h-5 text-[#7EC8E3]" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-16 w-80 bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4 text-[#7EC8E3]" />
                <h3 className="font-outfit text-sm font-semibold text-white">Access Control Panel</h3>
              </div>
              <p className="text-white/40 text-xs mb-4">Enter access code to unlock media management</p>
              <input
                type="password"
                value={accessAttempt}
                onChange={(e) => setAccessAttempt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAccessCode()}
                placeholder="Enter code"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm mb-3 placeholder-white/30"
              />
              <button
                onClick={handleAccessCode}
                className="w-full px-4 py-2 bg-[#7EC8E3]/20 border border-[#7EC8E3]/30 rounded-lg text-[#7EC8E3] text-sm font-medium hover:bg-[#7EC8E3]/30 transition-colors"
              >
                Unlock
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  // ── Authenticated panel ──────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-4 top-4 z-50"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-[#A8E6CF]/10 border border-[#A8E6CF]/20 flex items-center justify-center hover:bg-[#A8E6CF]/20 transition-colors"
      >
        <Settings className="w-5 h-5 text-[#A8E6CF]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="absolute right-0 top-16 w-96 max-h-[80vh] overflow-y-auto bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-outfit text-lg font-semibold text-white">Control Panel</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white/40" />
              </button>
            </div>

            {/* ── Music Section ── */}
            <div className="mb-6 pb-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-4 h-4 text-[#A8E6CF]" />
                <h4 className="font-outfit text-sm font-semibold text-white">Background Music</h4>
              </div>
              <div className="space-y-3">
                <button
                  onClick={toggleMusic}
                  className="w-full px-3 py-2 bg-[#A8E6CF]/20 border border-[#A8E6CF]/30 rounded-lg text-[#A8E6CF] text-sm font-medium hover:bg-[#A8E6CF]/30 transition-colors"
                >
                  {isPlaying ? 'Pause Music' : 'Play Music'}
                </button>

                <input
                  type="range"
                  min="0" max="1" step="0.05"
                  value={sharedVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-white/40">Volume: {Math.round(sharedVolume * 100)}%</div>

                {/* Music file upload (audio OR video → audio extracted by browser) */}
                <input
                  ref={musicInputRef}
                  type="file"
                  accept="audio/*,video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleMusicUpload(file)
                    e.target.value = ''
                  }}
                />
                <button
                  onClick={() => musicInputRef.current?.click()}
                  disabled={uploading === 'backgroundMusic'}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 text-xs hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <FileVideo className="w-3.5 h-3.5" />
                  {uploading === 'backgroundMusic'
                    ? 'Uploading…'
                    : uploadSuccess === 'backgroundMusic'
                    ? '✓ Music updated!'
                    : urls.backgroundMusic
                    ? 'Replace Music (audio or video file)'
                    : 'Upload Music (audio or video file)'}
                </button>
                {urls.backgroundMusic && (
                  <button
                    onClick={() => resetMedia('backgroundMusic')}
                    className="w-full px-3 py-1.5 text-xs text-white/30 hover:text-white/50 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 inline mr-1" />
                    Reset to default music
                  </button>
                )}
              </div>
            </div>

            {/* ── QR Code Section ── */}
            <div className="mb-6 pb-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 mb-4">
                <QrCode className="w-4 h-4 text-[#7EC8E3]" />
                <h4 className="font-outfit text-sm font-semibold text-white">QR Code</h4>
              </div>
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="w-full px-3 py-2 bg-[#7EC8E3]/20 border border-[#7EC8E3]/30 rounded-lg text-[#7EC8E3] text-sm font-medium hover:bg-[#7EC8E3]/30 transition-colors"
              >
                {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
              </button>
              {showQRCode && (
                <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                  <img
                    src="/manus-storage/QR_Code_Website_03746020.png"
                    alt="QR Code"
                    className="w-40 h-40"
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Image className="w-4 h-4 text-[#7EC8E3]" />
                <h4 className="font-outfit text-sm font-semibold text-white">Media Management</h4>
              </div>
              <div className="space-y-3">
                {MEDIA_ITEMS.map((item) => {
                  const hasCustom = !!urls[item.id]
                  const isUp = uploading === item.id
                  const isDone = uploadSuccess === item.id
                  return (
                    <div key={item.id} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {item.type === 'video'
                            ? <Video className="w-3.5 h-3.5 text-[#7EC8E3]" />
                            : <Image className="w-3.5 h-3.5 text-[#A8E6CF]" />}
                          <span className="text-xs font-medium text-white">{item.name}</span>
                          {hasCustom && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#A8E6CF]/10 text-[#A8E6CF]">
                              Custom
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-white/30">{item.section}</span>
                      </div>

                      <input
                        ref={(el) => { mediaInputRefs.current[item.id] = el }}
                        type="file"
                        accept={item.accept}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleMediaUpload(item.id, file)
                          e.target.value = ''
                        }}
                      />

                      <button
                        onClick={() => mediaInputRefs.current[item.id]?.click()}
                        disabled={isUp || isSavingGlobal}
                        className="w-full px-2 py-1.5 text-xs bg-[#7EC8E3]/10 border border-[#7EC8E3]/20 hover:bg-[#7EC8E3]/20 rounded text-[#7EC8E3] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Upload className="w-3 h-3" />
                        {isUp ? 'Uploading…' : isDone ? '✓ Updated locally!' : hasCustom ? `Replace ${item.type === 'video' ? 'Video' : 'Image'}` : `Upload ${item.type === 'video' ? 'Video' : 'Image'}`}
                      </button>

                      {hasCustom && (
                        <button
                          onClick={() => resetMedia(item.id)}
                          disabled={isSavingGlobal}
                          className="w-full mt-1 px-2 py-1 text-[10px] text-white/30 hover:text-white/50 transition-colors"
                        >
                          <RotateCcw className="w-2.5 h-2.5 inline mr-1" />
                          Reset to default
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Global Sync Save Button */}
            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <button
                onClick={handleGlobalSync}
                disabled={isSavingGlobal}
                className="w-full py-3 bg-gradient-to-r from-[#A8E6CF] to-[#7EC8E3] text-black rounded-xl font-bold font-outfit shadow-[0_0_20px_rgba(168,230,207,0.3)] hover:shadow-[0_0_30px_rgba(168,230,207,0.5)] transition-all flex flex-col items-center justify-center gap-1"
              >
                {isSavingGlobal ? (
                  <>
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Saving to Cloud...
                    </span>
                    <span className="text-[10px] opacity-80 font-medium">Please do not close this window</span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-2">
                      <Save className="w-5 h-5" />
                      حفظ كل التغييرات والخروج
                    </span>
                    <span className="text-[10px] opacity-80 font-medium tracking-wide uppercase">Publish Globally to All Users</span>
                  </>
                )}
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
