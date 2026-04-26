import { motion } from 'framer-motion'
import { Quote, ArrowUpRight, BookOpen } from 'lucide-react'

export default function ClosingSection() {
  return (
    <section className="relative py-32 px-4 sm:px-6 overflow-hidden">
      {/* Large ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#7EC8E3]/[0.03] blur-[180px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#A8E6CF]/[0.02] blur-[120px]" />
      </div>

      {/* Decorative quote marks */}
      <div className="absolute top-16 left-8 sm:left-16 pointer-events-none opacity-[0.03]">
        <Quote className="w-32 h-32 sm:w-48 sm:h-48 text-white" />
      </div>
      <div className="absolute bottom-16 right-8 sm:right-16 pointer-events-none opacity-[0.03] rotate-180">
        <Quote className="w-32 h-32 sm:w-48 sm:h-48 text-white" />
      </div>

      <div className="max-w-[900px] mx-auto relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 text-white/30 text-xs font-barlow uppercase tracking-[0.2em]">
            <BookOpen className="w-3.5 h-3.5" />
            Closing Statement
          </span>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="glow-card p-8 sm:p-12 md:p-14 gradient-border">
            <blockquote className="font-nunito text-lg sm:text-xl md:text-2xl text-white/80 leading-relaxed text-center">
              So that&apos;s why, it is time to stop teaching a language that doesn&apos;t exist in the street and start
              giving our students the keys to the real world; because they don&apos;t just need to pass an exam,{' '}
              <span className="text-white font-semibold">they gotta understand the sounds of reality</span>.
            </blockquote>

            <div className="mt-8 flex items-center justify-center">
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#7EC8E3]/50 to-transparent" />
            </div>

            <p className="mt-6 text-center font-nunito text-base sm:text-lg text-[#A8E6CF]/80 leading-relaxed">
              My research is the bridge that turns them from{' '}
              <span className="text-[#7EC8E3] font-semibold">&lsquo;exam-passers&rsquo;</span> into{' '}
              <span className="text-[#A8E6CF] font-semibold">&lsquo;real-world listeners&rsquo;</span>.
            </p>
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#7EC8E3]/15 border border-[#7EC8E3]/30 text-[#7EC8E3] font-barlow font-medium text-sm hover:bg-[#7EC8E3]/25 hover:border-[#7EC8E3]/50 transition-all duration-300"
          >
            <BookOpen className="w-4 h-4" />
            Explore the Research
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <a
            href="mailto:abdullah.ibrahim.ali@email.com"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/60 font-barlow font-medium text-sm hover:bg-white/[0.08] hover:border-white/[0.2] hover:text-white/80 transition-all duration-300"
          >
            Contact Me
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
