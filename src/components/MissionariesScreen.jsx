import { useEffect, useMemo, useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import StepController from './shared/StepController.jsx'
import { missionariesSolve } from '../utils/solvers.js'

function Character({ type }) {
  return (
    <Motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`w-10 h-10 flex items-center justify-center rounded-full text-2xl shadow-lg border-2 ${type === 'M' ? 'bg-blue-500/30 border-blue-400' : 'bg-red-500/30 border-red-400'}`}
    >
      {type === 'M' ? '👤' : '👺'}
    </Motion.div>
  )
}

export default function MissionariesScreen() {
  const [m, setM] = useState(3)
  const [c, setC] = useState(3)
  const [cap, setCap] = useState(2)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [error, setError] = useState('')

  const intervalMs = useMemo(() => 2000 / (speed * 2), [speed])

  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => {
      setCurrentStep((s) => {
        const next = s + 1
        if (next >= steps.length) {
          setIsPlaying(false)
          return s
        }
        return next
      })
    }, intervalMs)
    return () => clearInterval(id)
  }, [isPlaying, steps.length, intervalMs])

  function solve() {
    const res = missionariesSolve(m, c, cap)
    setSteps(res)
    setCurrentStep(0)
    setIsPlaying(false)
    if (!res.length) setError('No valid solution for this configuration')
    else setError('')
  }

  function resetPlayback() {
    setSteps([])
    setCurrentStep(0)
    setIsPlaying(false)
    setError('')
  }

  const s = steps[currentStep]
  const isInitial = !s
  
  const mLeft = isInitial ? m : s.mLeft
  const cLeft = isInitial ? c : s.cLeft
  const mRight = isInitial ? 0 : s.mRight
  const cRight = isInitial ? 0 : s.cRight
  const boatOnLeft = isInitial ? true : s.boatOnLeft
  const move = s?.move || { m: 0, c: 0 }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Panel: Controls */}
      <div className="w-full lg:w-96 p-6 space-y-8 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 pt-20">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-amber-400 mb-6">River Crossing</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Missionaries</label>
              <input
                type="number"
                min="1" max="5"
                value={m}
                onChange={(e) => setM(parseInt(e.target.value) || 3)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500/50 transition-all font-bold text-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Cannibals</label>
              <input
                type="number"
                min="1" max="5"
                value={c}
                onChange={(e) => setC(parseInt(e.target.value) || 3)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500/50 transition-all font-bold text-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Boat Capacity</label>
              <input
                type="number"
                min="1" max="3"
                value={cap}
                onChange={(e) => setCap(parseInt(e.target.value) || 2)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500/50 transition-all font-bold text-lg"
              />
            </div>
          </div>
        </div>

        <button
          onClick={solve}
          className="w-full py-4 text-lg bg-amber-600 hover:bg-amber-500 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)]"
        >
          START VOYAGE
        </button>

        <AnimatePresence>
          {error && (
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm font-bold text-center"
            >
              {error}
            </Motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content: River View & Controls */}
      <div className="flex-1 flex flex-col p-6 lg:p-10 space-y-6 overflow-hidden">
        <div className="flex-1 glass-dark rounded-3xl relative overflow-hidden group border border-white/5">
          <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="h-full flex flex-col">
            <div className="flex-1 relative flex items-center justify-between px-10 md:px-20">
              
              {/* Left Bank */}
              <div className="flex flex-col items-center gap-6 z-10">
                <div className="text-xs font-black uppercase tracking-widest text-slate-500 bg-black/40 px-3 py-1 rounded-full">Left Bank</div>
                <div className="grid grid-cols-2 gap-3 min-h-[100px] w-24">
                  {Array.from({ length: mLeft }).map((_, i) => <Character key={`m-l-${i}`} type="M" />)}
                  {Array.from({ length: cLeft }).map((_, i) => <Character key={`c-l-${i}`} type="C" />)}
                </div>
              </div>

              {/* River & Boat Area */}
              <div className="flex-1 h-40 mx-4 relative border-b-8 border-cyan-500/20 self-center">
                <Motion.div
                  animate={{ x: boatOnLeft ? '0%' : '100%' }}
                  transition={{ type: 'spring', stiffness: 40, damping: 15 }}
                  className="absolute bottom-4 -ml-12 flex flex-col items-center gap-2"
                >
                  {/* Characters on Boat */}
                  <div className="flex gap-1 mb-1">
                    {Array.from({ length: move.m }).map((_, i) => <Character key={`m-b-${i}`} type="M" />)}
                    {Array.from({ length: move.c }).map((_, i) => <Character key={`c-b-${i}`} type="C" />)}
                  </div>
                  <div className="text-7xl drop-shadow-2xl">⛵</div>
                </Motion.div>
              </div>

              {/* Right Bank */}
              <div className="flex flex-col items-center gap-6 z-10">
                <div className="text-xs font-black uppercase tracking-widest text-slate-500 bg-black/40 px-3 py-1 rounded-full">Right Bank</div>
                <div className="grid grid-cols-2 gap-3 min-h-[100px] w-24">
                  {Array.from({ length: mRight }).map((_, i) => <Character key={`m-r-${i}`} type="M" />)}
                  {Array.from({ length: cRight }).map((_, i) => <Character key={`c-r-${i}`} type="C" />)}
                </div>
              </div>

            </div>
            
            <div className="p-8 text-center bg-black/40 backdrop-blur-sm border-t border-white/5">
              <div className="text-2xl font-black text-white tracking-tighter uppercase italic">
                {s?.move ? `TRANSFER: ${s.move.m} MISSIONARIES & ${s.move.c} CANNIBALS` : 'WAITING AT DOCK'}
              </div>
            </div>
          </div>
        </div>

        <StepController
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          isPlaying={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onReset={resetPlayback}
          speed={speed}
          onSpeedChange={setSpeed}
        />
      </div>
    </div>
  )
}
