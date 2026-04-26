import { GraduationCap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] py-10 px-4 sm:px-6">
      <div className="max-w-[1140px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#7EC8E3]/10 border border-[#7EC8E3]/20 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-[#7EC8E3]" />
          </div>
          <span className="text-white/30 font-barlow text-sm">
            &copy; 2026 Abdullah Ibrahim Ali
          </span>
        </div>
        <p className="text-white/20 font-barlow text-xs tracking-wider uppercase">
          Doctoral Research in English Language Teaching
        </p>
      </div>
    </footer>
  )
}
