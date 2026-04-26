import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Play, Pause, Volume2, VolumeX, X } from 'lucide-react'

interface FloatingMusicControlProps {
  backgroundMusic: HTMLAudioElement | null
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  volume: number
  setVolume: (volume: number) => void
}

export default function FloatingMusicControl({
  backgroundMusic,
  isPlaying,
  setIsPlaying,
  volume,
  setVolume,
}: FloatingMusicControlProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const togglePlay = () => {
    if (!backgroundMusic) return
    if (isPlaying) {
      backgroundMusic.pause()
    } else {
      backgroundMusic.play().catch(() => {})
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!backgroundMusic) return
    if (isMuted) {
      backgroundMusic.volume = volume
      setIsMuted(false)
    } else {
      backgroundMusic.volume = 0
      setIsMuted(true)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (backgroundMusic) {
      backgroundMusic.volume = newVolume
      if (newVolume > 0 && isMuted) {
        setIsMuted(false)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-4 bottom-4 z-40"
    >
      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#A8E6CF]/20 to-[#7EC8E3]/20 border border-[#A8E6CF]/30 flex items-center justify-center hover:from-[#A8E6CF]/30 hover:to-[#7EC8E3]/30 transition-all shadow-lg hover:shadow-xl"
      >
        <Music className="w-6 h-6 text-[#A8E6CF]" />
      </button>

      {/* Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-72 bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#A8E6CF]/10 border border-[#A8E6CF]/20 flex items-center justify-center">
                  <Music className="w-4 h-4 text-[#A8E6CF]" />
                </div>
                <h3 className="font-outfit text-sm font-semibold text-white">Background Music</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white/40" />
              </button>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-full px-4 py-3 mb-4 bg-[#A8E6CF]/20 border border-[#A8E6CF]/30 rounded-lg text-[#A8E6CF] text-sm font-medium hover:bg-[#A8E6CF]/30 transition-colors flex items-center justify-center gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause Music
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Play Music
                </>
              )}
            </button>

            {/* Volume Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/50 font-barlow uppercase tracking-wider">Volume</label>
                <span className="text-xs text-white/40">{Math.round(volume * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-white/40 hover:text-white/60" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white/40 hover:text-white/60" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#A8E6CF]"
                  style={{
                    background: `linear-gradient(to right, #A8E6CF 0%, #A8E6CF ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%, rgba(255,255,255,0.1) 100%)`,
                  }}
                />
              </div>
            </div>

            {/* Status */}
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <p className="text-xs text-white/30 text-center">
                {isPlaying ? '🎵 Now Playing' : '⏸ Paused'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
