import { motion as Motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import useApp from '../../context/useApp.js'

const themes = {
  BFS: 'from-blue-900 via-cyan-700 to-blue-800',
  DFS: 'from-green-900 via-lime-700 to-green-800',
  Missionaries: 'from-amber-700 via-teal-600 to-amber-800',
  Cryptarithmetic: 'from-purple-900 via-yellow-600 to-purple-800',
}

export default function ThemeWrapper({ problem, children }) {
  const { setCurrentScreen } = useApp()
  const grad = themes[problem] || 'from-gray-900 via-gray-800 to-black'
  
  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={`min-h-screen w-full bg-gradient-to-br ${grad} text-white relative`}
    >
      <div className="absolute top-6 left-6 z-50">
        <button
          onClick={() => setCurrentScreen('selection')}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl font-bold transition-all border border-white/10 active:scale-95 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          MENU
        </button>
      </div>
      <div className="min-h-screen w-full bg-opacity-60">{children}</div>
    </Motion.div>
  )
}
