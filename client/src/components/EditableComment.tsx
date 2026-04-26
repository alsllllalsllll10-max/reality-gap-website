import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Check, RotateCcw } from 'lucide-react'
import { useMedia } from '../contexts/MediaContext'

interface EditableCommentProps {
  defaultText: string
  storageKey: string
  label?: string
}

export default function EditableComment({ defaultText, storageKey, label }: EditableCommentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState('')
  const [savedText, setSavedText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { remoteTexts, isAccessGranted } = useMedia()

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored !== null) {
      setSavedText(stored)
      setText(stored)
    } else if (remoteTexts[storageKey]) {
      setSavedText(remoteTexts[storageKey])
      setText(remoteTexts[storageKey])
    } else {
      setSavedText(defaultText)
      setText(defaultText)
    }
  }, [storageKey, defaultText, remoteTexts])

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(text.length, text.length)
    }
  }, [isEditing, text])

  const handleSave = useCallback(() => {
    const trimmed = text.trim()
    if (trimmed) {
      setSavedText(trimmed)
      localStorage.setItem(storageKey, trimmed)
    }
    setIsEditing(false)
  }, [text, storageKey])

  const handleReset = useCallback(() => {
    setText(defaultText)
    setSavedText(defaultText)
    localStorage.removeItem(storageKey)
    setIsEditing(false)
  }, [defaultText, storageKey])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setText(savedText)
        setIsEditing(false)
      }
    },
    [savedText]
  )

  return (
    <div className="relative">
      {label && (
        <div className="flex items-center gap-2 mb-3">
          <Pencil className="w-3.5 h-3.5 text-white/30" />
          <span className="text-white/30 text-xs font-barlow uppercase tracking-wider">{label}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full min-h-[100px] p-4 rounded-xl bg-[#111] border border-[#7EC8E3]/30 text-white/80 font-nunito text-sm leading-relaxed resize-y focus:outline-none focus:border-[#7EC8E3]/60 focus:ring-1 focus:ring-[#7EC8E3]/20 transition-all"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7EC8E3]/15 border border-[#7EC8E3]/30 text-[#7EC8E3] text-sm font-barlow font-medium hover:bg-[#7EC8E3]/25 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Save
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white/40 text-sm font-barlow hover:bg-white/[0.08] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
              <button
                onClick={() => {
                  setText(savedText)
                  setIsEditing(false)
                }}
                className="inline-flex items-center px-4 py-2 rounded-lg text-white/30 text-sm font-barlow hover:text-white/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25 }}
            className="group relative"
          >
            <div className="relative">
              <p className="text-white/50 font-nunito text-sm leading-relaxed pr-10 whitespace-pre-wrap break-words">
                {savedText}
              </p>
              {/* Edit button */}
              {isAccessGranted && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute top-0 right-0 w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#7EC8E3]/10 hover:border-[#7EC8E3]/30 transition-all duration-300"
                  title="Edit analysis"
                >
                  <Pencil className="w-3.5 h-3.5 text-white/50 group-hover:text-[#7EC8E3] transition-colors" />
                </button>
              )}
            </div>
            {/* Mobile always-visible edit button */}
            {isAccessGranted && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-3 md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white/40 text-xs font-barlow"
              >
                <Pencil className="w-3 h-3" />
                Edit
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
