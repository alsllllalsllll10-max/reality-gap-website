import { motion } from 'framer-motion'
import { TrendingUp, BarChart3, Radar } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar } from 'recharts'
import EditableComment from '@/components/EditableComment'

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

// Data for charts
const realityGapData = [
  { name: 'Textbook', value: 3, fill: '#7EC8E3' },
  { name: 'Movies/TV', value: 1247, fill: '#A8E6CF' },
]

const performanceData = [
  { label: 'Pre-Test', value: 11.4 },
  { label: 'Post-Test', value: 20.7 },
]

const studentFeedbackData = [
  { category: 'Liked Clips', value: 93 },
  { category: 'Want More Media', value: 97 },
  { category: 'Recognize Forms', value: 87 },
  { category: 'Improved Listening', value: 91 },
  { category: 'Better Comprehension', value: 89 },
]

const COLORS = ['#7EC8E3', '#A8E6CF', '#FFB6C1', '#DDA0DD', '#87CEEB']

export default function DataVisualizationSection() {
  return (
    <section className="relative py-28 px-4 sm:px-6">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#A8E6CF]/[0.02] blur-[150px]" />
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-[#7EC8E3]/[0.02] blur-[120px]" />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="font-outfit text-3xl sm:text-4xl md:text-[42px] font-bold text-white mb-3 tracking-tight">
            Advanced Data <span className="text-[#A8E6CF]">Visualization</span>
          </h2>
          <p className="text-white/40 font-barlow text-sm tracking-wider uppercase">
            The Visual Proof — Research Findings at a Glance
          </p>
        </motion.div>

        {/* Charts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Chart 1: Reality Chasm */}
          <motion.div
            variants={itemVariants}
            className="glow-card p-6 sm:p-8 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#7EC8E3]/10 border border-[#7EC8E3]/20 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-[#7EC8E3]" />
              </div>
              <h3 className="font-outfit text-lg font-semibold text-white">The Reality Gap</h3>
            </div>
            <p className="text-white/40 text-xs font-barlow mb-6">Connected Speech Frequency Comparison</p>
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={realityGapData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" />
                  <YAxis stroke="rgba(255,255,255,0.3)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10, 10, 10, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="value" fill="#7EC8E3" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <EditableComment
                defaultText="Look at this. The textbook is like a silent room with only 3 cases. But movies are a loud party with 1,247 cases. Our students wanna hear the truth, but the book is hiding it. Lemme tell you, this gap is the reason why students feel lost in the street."
                storageKey="rg_chart_reality_gap"
                label="Analytical Commentary"
              />
            </div>
          </motion.div>

          {/* Chart 2: Achievement Leap */}
          <motion.div
            variants={itemVariants}
            className="glow-card p-6 sm:p-8 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#A8E6CF]/10 border border-[#A8E6CF]/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#A8E6CF]" />
              </div>
              <h3 className="font-outfit text-lg font-semibold text-white">The Achievement Leap</h3>
            </div>
            <p className="text-white/40 text-xs font-barlow mb-6">Pre-Test vs. Post-Test Performance (6 Weeks)</p>
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" />
                  <YAxis stroke="rgba(255,255,255,0.3)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10, 10, 10, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#A8E6CF"
                    strokeWidth={3}
                    dot={{ fill: '#A8E6CF', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <EditableComment
                defaultText="See the blue arrow. Students started low at 11.4. But after my 6-week plan, they jumped to 20.7. This is an 81% success. They are gonna be great listeners now, because we gave them real English, not robot English."
                storageKey="rg_chart_achievement_leap"
                label="Analytical Commentary"
              />
            </div>
          </motion.div>

          {/* Chart 3: Student Voice Radar */}
          <motion.div
            variants={itemVariants}
            className="glow-card p-6 sm:p-8 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#FFB6C1]/10 border border-[#FFB6C1]/20 flex items-center justify-center">
                <Radar className="w-4 h-4 text-[#FFB6C1]" />
              </div>
              <h3 className="font-outfit text-lg font-semibold text-white">Student Voice Radar</h3>
            </div>
            <p className="text-white/40 text-xs font-barlow mb-6">Feedback Visualization (Al-Tali'a Students)</p>
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={studentFeedbackData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="category" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis stroke="rgba(255,255,255,0.2)" />
                  <RechartsRadar
                    name="Satisfaction %"
                    dataKey="value"
                    stroke="#FFB6C1"
                    fill="#FFB6C1"
                    fillOpacity={0.3}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10, 10, 10, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <EditableComment
                defaultText="Now, lemme show you what the students think. I gave them a questionnaire, and the results are remarkable. 97% of them say they wanna use movies in every class. They are not bored anymore. They're gonna study harder, because English is finally real for them."
                storageKey="rg_chart_student_voice"
                label="Analytical Commentary"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="glow-card p-6 text-center">
            <p className="font-outfit text-5xl font-bold text-[#7EC8E3] mb-2">415x</p>
            <p className="text-white/40 text-xs font-barlow uppercase tracking-wider">Gap Multiplier</p>
          </div>
          <div className="glow-card p-6 text-center">
            <p className="font-outfit text-5xl font-bold text-[#A8E6CF] mb-2">81%</p>
            <p className="text-white/40 text-xs font-barlow uppercase tracking-wider">Improvement Rate</p>
          </div>
          <div className="glow-card p-6 text-center">
            <p className="font-outfit text-5xl font-bold text-[#FFB6C1] mb-2">93%</p>
            <p className="text-white/40 text-xs font-barlow uppercase tracking-wider">Student Satisfaction</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
