import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, X, Download } from 'lucide-react'

export default function FloatingQRCode() {
  const [isOpen, setIsOpen] = useState(false)

  const downloadQR = () => {
    const link = document.createElement('a')
    link.href = '/QR_Code_Website.png'
    link.download = 'reality-gap-qr-code.png'
    link.click()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="fixed right-4 top-24 z-40"
    >
      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7EC8E3]/20 to-[#A8E6CF]/20 border border-[#7EC8E3]/30 flex items-center justify-center hover:from-[#7EC8E3]/30 hover:to-[#A8E6CF]/30 transition-all shadow-lg hover:shadow-xl"
      >
        <QrCode className="w-6 h-6 text-[#7EC8E3]" />
      </button>

      {/* QR Code Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 right-0 w-80 bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#7EC8E3]/10 border border-[#7EC8E3]/20 flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-[#7EC8E3]" />
                </div>
                <h3 className="font-outfit text-sm font-semibold text-white">QR Code</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white/40" />
              </button>
            </div>

            {/* QR Code Image */}
            <div className="mb-4 p-4 bg-white rounded-lg flex items-center justify-center">
              <img
                src="/QR_Code_Website.png"
                alt="QR Code"
                className="w-full max-w-xs"
              />
            </div>

            {/* Description */}
            <p className="text-xs text-white/50 text-center mb-4 font-nunito">
              Scan this QR code with your camera to access the Reality Gap project directly.
            </p>

            {/* Download Button */}
            <button
              onClick={downloadQR}
              className="w-full px-4 py-3 bg-[#7EC8E3]/20 border border-[#7EC8E3]/30 rounded-lg text-[#7EC8E3] text-sm font-medium hover:bg-[#7EC8E3]/30 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download QR Code
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
