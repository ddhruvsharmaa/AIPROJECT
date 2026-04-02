import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import useApp from '../context/useApp.js'

export default function WelcomeScreen() {
  const { setUserName, setCurrentScreen } = useApp()
  const [name, setName] = useState('')
  function submit() {
    if (!name.trim()) return
    setUserName(name.trim())
    setCurrentScreen('selection')
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Motion.div
        initial={{ backgroundPosition: '0% 50%' }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 bg-[length:200%_200%]"
      />
      
      <Motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="glass-dark w-full max-w-md rounded-2xl p-10 text-center"
      >
        <Motion.h1 
          className="text-4xl font-black mb-8 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ALGO-PUZZLE SOLVER
        </Motion.h1>

        <div className="space-y-6">
          <div className="text-left">
            <label className="block text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Explorer Identity</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Neo"
              className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all text-lg font-medium"
            />
          </div>

          <button
            disabled={!name.trim()}
            onClick={submit}
            className="btn-primary w-full py-4 text-xl tracking-wide"
          >
            ENTER THE MATRIX
          </button>
        </div>
      </Motion.div>
    </div>
  )
}
