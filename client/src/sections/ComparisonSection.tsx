import { motion } from 'framer-motion'
import { BookOpen, Clapperboard, ArrowRight, Hash } from 'lucide-react'

const comparisons = [
  {
    id: 1,
    textbook: 'Are you coming with me?',
    textbookRef: '(Unit 5, p. 45)',
    reality: "Wanna come with?",
    gap: 'Informal Contraction',
  },
  {
    id: 2,
    textbook: 'How do you do, sir?',
    textbookRef: '(Unit 6, p. 58)',
    reality: "How's it goin' sir?",
    gap: 'Connected Speech',
  },
  {
    id: 3,
    textbook: 'I am quite short.',
    textbookRef: '(Unit 6, p. 57)',
    reality: "I'm kinda short.",
    gap: 'Reduction (Schwa)',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

export default function ComparisonSection() {
  return (
    <section className="relative py-28 px-4 sm:px-6">
      {/* Section background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[#7EC8E3]/[0.02] blur-[150px]" />
      </div>

      <div className="max-w-[1100px] mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="font-outfit text-3xl sm:text-4xl md:text-[42px] font-bold text-white mb-3 tracking-tight">
            The Reality Gap <span className="text-[#7EC8E3]">in Action</span>
          </h2>
          <p className="text-white/40 font-barlow text-sm tracking-wider uppercase">
            Textbook vs. Real-World English
          </p>
        </motion.div>

        {/* Column headers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden md:grid grid-cols-[60px_1fr_1fr_180px] gap-4 mb-6 px-6"
        >
          <div className="flex items-center justify-center">
            <Hash className="w-4 h-4 text-white/30" />
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-[#7EC8E3]" />
            <span className="text-white/50 font-barlow text-sm font-medium uppercase tracking-wider">
              Textbook
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clapperboard className="w-5 h-5 text-[#A8E6CF]" />
            <span className="text-white/50 font-barlow text-sm font-medium uppercase tracking-wider">
              Reality
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-white/50 font-barlow text-sm font-medium uppercase tracking-wider">
              Linguistic Gap
            </span>
          </div>
        </motion.div>

        {/* Comparison rows */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="space-y-4"
        >
          {comparisons.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="glow-card group"
            >
              <div className="grid grid-cols-1 md:grid-cols-[60px_1fr_1fr_180px] gap-4 p-5 sm:p-6 items-center">
                {/* Number */}
                <div className="flex items-center gap-3 md:justify-center">
                  <span className="font-outfit text-xl font-bold text-white/20 group-hover:text-[#7EC8E3]/60 transition-colors">
                    {String(item.id).padStart(2, '0')}
                  </span>
                  {/* Mobile icons */}
                  <div className="md:hidden flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#7EC8E3]" />
                    <span className="text-white/40 text-xs">Textbook</span>
                  </div>
                </div>

                {/* Textbook */}
                <div className="space-y-1">
                  <p className="text-white font-nunito text-[15px] leading-relaxed">&quot;{item.textbook}&quot;</p>
                  <p className="text-white/30 text-xs font-barlow">{item.textbookRef}</p>
                </div>

                {/* Arrow + Reality */}
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-[#A8E6CF]/10 border border-[#A8E6CF]/20 shrink-0">
                    <ArrowRight className="w-3 h-3 text-[#A8E6CF]" />
                  </div>
                  <div className="md:hidden text-white/20 text-xs">→</div>
                  <p className="text-[#A8E6CF] font-nunito text-[15px] font-semibold leading-relaxed">
                    &quot;{item.reality}&quot;
                  </p>
                </div>

                {/* Gap label */}
                <div>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#7EC8E3]/10 border border-[#7EC8E3]/20 text-[#7EC8E3] text-xs font-barlow font-medium">
                    {item.gap}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 grid grid-cols-2 gap-4 max-w-md mx-auto"
        >
          <div className="text-center p-5 rounded-2xl bg-[#0A0A0A] border border-white/[0.06]">
            <p className="font-outfit text-4xl font-bold text-[#7EC8E3] mb-1">3</p>
            <p className="text-white/40 text-xs font-barlow uppercase tracking-wider">Cases in Book</p>
          </div>
          <div className="text-center p-5 rounded-2xl bg-[#0A0A0A] border border-white/[0.06]">
            <p className="font-outfit text-4xl font-bold text-[#A8E6CF] mb-1">1,247</p>
            <p className="text-white/40 text-xs font-barlow uppercase tracking-wider">Cases in Movies</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
