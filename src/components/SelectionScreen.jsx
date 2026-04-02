import { motion as Motion } from 'framer-motion'
import useApp from '../context/useApp.js'
import { Network, GitBranch, Users, KeySquare } from 'lucide-react'

const cards = [
  { key: 'BFS', name: 'BFS', desc: 'Breadth-first search for shortest paths', icon: Network },
  { key: 'DFS', name: 'DFS', desc: 'Depth-first search exploration', icon: GitBranch },
  { key: 'Missionaries', name: 'Missionaries & Cannibals', desc: 'Safe river crossing', icon: Users },
  { key: 'Cryptarithmetic', name: 'Cryptarithmetic', desc: 'Solve letter-digit puzzles', icon: KeySquare },
]

export default function SelectionScreen() {
  const { userName, setSelectedProblem, setCurrentScreen } = useApp()
  function choose(key) {
    setSelectedProblem(key)
    setCurrentScreen('problem')
  }
  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 overflow-y-auto">
      <Motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Welcome, {userName}!
          </h1>
          <p className="text-slate-400 text-lg font-medium">Choose your algorithmic challenge</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((p, i) => (
            <Motion.div
              key={p.key}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => choose(p.key)}
              className="group glass-dark p-8 rounded-3xl cursor-pointer relative overflow-hidden transition-all border-white/5 hover:border-blue-500/30 text-white"
            >
              <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:text-blue-500/20 transition-colors">
                <p.icon size={120} strokeWidth={1} />
              </div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  <p.icon size={28} />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-white tracking-tight">{p.name}</h2>
                <p className="text-slate-400 text-lg leading-relaxed">{p.desc}</p>
              </div>
            </Motion.div>
          ))}
        </div>
      </Motion.div>
    </div>
  )
}
