import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import EditableComment from '@/components/EditableComment'
import { useMedia } from '@/contexts/MediaContext'

interface HeroSectionProps {
  backgroundMusic?: HTMLAudioElement | null
  isPlaying?: boolean
  setIsPlaying?: (playing: boolean) => void
}

export default function HeroSection({ backgroundMusic, isPlaying: bgIsPlaying, setIsPlaying: setBgIsPlaying }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { urls } = useMedia()
  const videoSrc = urls.heroVideo || null

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const scrollY = window.scrollY
      const cards = sectionRef.current.querySelectorAll('.parallax-card')
      cards.forEach((card) => {
        const el = card as HTMLElement
        el.style.transform = `translateY(${scrollY * 0.05}px)`
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle video play/pause and background music
  useEffect(() => {
    if (!videoRef.current || !backgroundMusic) return

    const video = videoRef.current

    const handlePlay = () => {
      // Pause background music when video plays
      if (backgroundMusic && backgroundMusic.paused === false) {
        backgroundMusic.pause()
        if (setBgIsPlaying) setBgIsPlaying(false)
      }
    }

    const handlePause = () => {
      // Resume background music when video pauses
      if (backgroundMusic && isPlaying) {
        backgroundMusic.play().catch(() => {
          console.log('Could not autoplay background music')
        })
        if (setBgIsPlaying) setBgIsPlaying(true)
      }
    }

    const handleEnded = () => {
      // Resume background music when video ends
      if (backgroundMusic) {
        backgroundMusic.play().catch(() => {
          console.log('Could not autoplay background music')
        })
        if (setBgIsPlaying) setBgIsPlaying(true)
      }
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [backgroundMusic, isPlaying, setBgIsPlaying])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setHasStarted(true)
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-16 pb-20 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#7EC8E3]/[0.03] blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#A8E6CF]/[0.03] blur-[120px]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.7,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-8 relative z-10"
      >
        <h1 className="shimmer-text font-outfit text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none mb-4">
          The Reality Gap
        </h1>
        <p className="text-white/60 font-outfit text-xl sm:text-2xl font-semibold mb-3">
          Abdullah Ibrahim Ali
        </p>
        <p className="text-white/50 font-barlow text-base sm:text-lg tracking-wide">
          Bridging Classroom English & Real-World Speech
        </p>
      </motion.div>

      {/* Video Card — Floating */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="video-wrapper relative parallax-card z-10"
      >
        {/* Orbital ring */}
        <div className="orbital-ring rounded-[24px]" />

        <div className="relative w-[90vw] max-w-[720px] bg-[#0A0A0A] rounded-[20px] border border-white/[0.08] overflow-hidden shadow-card-hover">
          {/* Video area */}
          <div className="relative aspect-video bg-black">
            <video
              ref={videoRef}
              {...(videoSrc ? { src: videoSrc } : {})}
              className="w-full h-full object-cover"
              playsInline
              preload="metadata"
              onClick={togglePlay}
            />

            {/* Play overlay */}
            {!hasStarted && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer" onClick={togglePlay}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center"
                >
                  <Play className="w-7 h-7 text-white ml-1" fill="white" />
                </motion.div>
              </div>
            )}

            {/* Video controls */}
            {hasStarted && (
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                </button>
              </div>
            )}
          </div>

          {/* Video caption */}
          <div className="px-5 py-4 border-t border-white/[0.06]">
            <p className="text-white/40 text-xs font-barlow tracking-wider uppercase">
              Research Presentation Video
            </p>
          </div>
        </div>
      </motion.div>

      {/* Video Commentary - Editable */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl mx-auto mt-8 relative z-10 px-4"
      >
        <EditableComment
          defaultText="This is my research presentation on the Reality Gap between classroom English and authentic speech patterns used in real-world media and conversations. The video demonstrates the key findings and methodology of my study."
          storageKey="rg_video_commentary"
          label="Video Analysis"
        />
      </motion.div>

      {/* Intro Text */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto text-center mt-12 relative z-10 px-4"
      >
        <div className="space-y-5 text-white/70 font-nunito text-[15px] leading-relaxed">
          <p>
            Hello everyone. My name is Abdullah Ibrahim Ali, and today I&apos;m gonna talk about the Reality Gap between classroom English and how people actually speak in the US and the UK.
          </p>
          <p>
            Before I start, I wanna say a sincere thanks to my supervisor, Prof. Dr. Bushra Al-Noori. Since the day we started, you helped me so much and you kinda made my research incredible. I really appreciate your hard work, because I dunno how I could&apos;ve finished this without your help. Also, lemme say thanks to Dr. Furat for her great support during this journey. You are both so kind to me, and I&apos;m gonna remember your kindness forever.
          </p>
          <p>
            Now, in our classes, we learn to pronounce every single letter. But in real life, sounds disappear and words melt together.
          </p>
          <p className="text-[#A8E6CF] font-semibold text-lg">
            This is what I call the &quot;Reality Gap.&quot;
          </p>
          <p>
            My research shows that our English for Iraq book has only{' '}
            <span className="text-[#7EC8E3] font-bold text-lg">3 cases</span> of this, while movies have{' '}
            <span className="text-[#A8E6CF] font-bold text-lg">1,247 cases</span>.
          </p>
          <p className="text-white/50 text-sm pt-4">
            Here are four advanced examples of this gap from my study:
          </p>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs font-barlow tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-5 border-b-2 border-r-2 border-white/30 rotate-45"
        />
      </motion.div>
    </section>
  )
}
