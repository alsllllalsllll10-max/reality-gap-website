import { motion } from 'framer-motion'
import { Image, Users, Presentation } from 'lucide-react'
import EditableComment from '../components/EditableComment'
import { useMedia } from '../contexts/MediaContext'

const DEFAULT_IMAGES = [
  {
    id: 'imgPresentation' as const,
    defaultSrc: '/images/research-presentation.jpg',
    alt: 'Doctoral researcher presenting with interactive smartboard',
    icon: Presentation,
    title: 'Interactive Presentation',
    defaultComment:
      'A doctoral researcher presenting movie-based listening activities using an interactive smartboard. The scene shows real classroom integration of authentic English media, demonstrating how visual subtitles bridge the gap between textbook pronunciation and actual movie dialogue.',
    storageKey: 'rg_comment_presentation',
  },
  {
    id: 'imgFormalVsReal' as const,
    defaultSrc: '/manus-storage/Screenshot_٢٠٢٦٠٤٢٥-٢١٠٢١٠_WhatsApp_fc68c26c.jpg',
    alt: 'Formal English vs Real-Life English comparison on interactive smartboard',
    icon: Image,
    title: 'Formal vs Real English',
    defaultComment:
      "In this part, I showed them the difference between formal English and real-life English.\nI told them that Forget it is clear and common, and yeah, people use it a lot. It's simple and direct.\nThen we moved to real-life English. I showed them Let it slide. This is what people really say in daily situations.\nI told them: we're not gonna replace Forget it. It's still correct and useful.\nBut the main goal was this… when they hear Let it slide in a movie or real life, they don't get confused. They understand it fast and feel like it's normal.\nSo now, they can understand both, the book English and the real English.",
    storageKey: 'rg_comment_formal_vs_real',
  },
  {
    id: 'imgStudents' as const,
    defaultSrc: '/images/students-group.jpg',
    alt: 'Researcher with students after intensive listening program',
    icon: Users,
    title: 'Student Cohort Results',
    defaultComment:
      "The researcher alongside 9th-grade students after a 6-week intensive listening program. This cohort demonstrated a 30%+ improvement in connected speech recognition, proving that consistent exposure to real-world English dramatically enhances listening comprehension.",
    storageKey: 'rg_comment_students',
  },
  {
    id: 'imgClassroom' as const,
    defaultSrc: '/manus-storage/classroom_43dfcccf.png',
    alt: 'Classroom session implementing structured methodology',
    icon: Image,
    title: 'Classroom Implementation',
    defaultComment:
      "A full classroom session in progress at Al-Mutanabbi Secondary School. The researcher implements the structured 'English Reality Bridge' methodology — combining textbook foundations with authentic movie clips to train students on informal contractions, elisions, and connected speech patterns.",
    storageKey: 'rg_comment_classroom',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

export default function EvidenceSection() {
  const { urls } = useMedia()
  const images = DEFAULT_IMAGES.map((item) => ({
    ...item,
    src: urls[item.id] || item.defaultSrc,
  }))
  return (
    <section className="relative py-28 px-4 sm:px-6">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-[#A8E6CF]/[0.02] blur-[150px] -translate-y-1/2" />
      </div>

      <div className="max-w-[1140px] mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="font-outfit text-3xl sm:text-4xl md:text-[42px] font-bold text-white mb-3 tracking-tight">
            Research in <span className="text-[#A8E6CF]">Action</span>
          </h2>
          <p className="text-white/40 font-barlow text-sm tracking-wider uppercase">
            Visual Evidence from the Field
          </p>
        </motion.div>



        {/* Image grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {images.map((item) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="glow-card overflow-hidden group"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />

                  {/* Title badge */}
                  <div className="absolute top-4 left-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                      <Icon className="w-3.5 h-3.5 text-[#7EC8E3]" />
                      <span className="text-white/80 text-xs font-barlow font-medium">{item.title}</span>
                    </div>
                  </div>
                </div>

                {/* Analysis comment */}
                <div className="p-5 sm:p-6">
                  <EditableComment
                    defaultText={item.defaultComment}
                    storageKey={item.storageKey}
                    label="Image Analysis"
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
