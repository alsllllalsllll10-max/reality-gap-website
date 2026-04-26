import { useEffect, useState } from 'react'
import HeroSection from './sections/HeroSection'
import ComparisonSection from './sections/ComparisonSection'
import DataVisualizationSection from './sections/DataVisualizationSection'
import EvidenceSection from './sections/EvidenceSection'
import ClosingSection from './sections/ClosingSection'
import Footer from './sections/Footer'
import ControlPanel from './components/ControlPanel'
import { MediaProvider, useMedia } from './contexts/MediaContext'

function AppContent() {
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.9)
  const { urls, isLoading, isAccessGranted, setIsAccessGranted } = useMedia()

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp')
            entry.target.classList.remove('opacity-0', 'translate-y-10')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    const elements = document.querySelectorAll('.reveal-section')
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Initialize background music — prefer saved file, fallback to manus-storage
  useEffect(() => {
    if (isLoading) return // wait until IndexedDB is checked

    const musicSrc = urls.backgroundMusic || '/background-music.mp3'
    const audio = new Audio(musicSrc)
    audio.loop = true
    audio.volume = volume
    setBackgroundMusic(audio)

    const play = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch {
        // Browser blocked autoplay — user can enable from Control Panel
      }
    }
    setTimeout(play, 500)

    return () => {
      audio.pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]) // only on initial load

  // When user uploads new music via Control Panel, swap the audio element
  useEffect(() => {
    if (!urls.backgroundMusic || !backgroundMusic) return
    if (urls.backgroundMusic === backgroundMusic.src) return

    backgroundMusic.pause()
    const newAudio = new Audio(urls.backgroundMusic)
    newAudio.loop = true
    newAudio.volume = volume
    newAudio.play().catch(() => {})
    setBackgroundMusic(newAudio)
    setIsPlaying(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urls.backgroundMusic])

  // Sync volume changes
  useEffect(() => {
    if (backgroundMusic) backgroundMusic.volume = volume
  }, [volume, backgroundMusic])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <ControlPanel
        isAccessGranted={isAccessGranted}
        setIsAccessGranted={setIsAccessGranted}
        backgroundMusic={backgroundMusic}
        setBackgroundMusic={setBackgroundMusic}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        volume={volume}
        setVolume={setVolume}
      />
      <HeroSection backgroundMusic={backgroundMusic} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      <ComparisonSection />
      <DataVisualizationSection />
      <EvidenceSection />
      <ClosingSection />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <MediaProvider>
      <AppContent />
    </MediaProvider>
  )
}

export default App
