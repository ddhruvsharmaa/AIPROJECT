import { useEffect, useMemo, useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import StepController from './shared/StepController.jsx'
import { cryptSolve } from '../utils/solvers.js'

function toNum(word, map) {
  let v = ''
  for (const ch of word.toUpperCase()) {
    const d = map?.[ch]
    if (d == null) return null
    v += String(d)
  }
  return parseInt(v, 10)
}

function LetterBox({ ch, step, solvedDigit }) {
  const status = step?.letter === ch ? step?.status : null
  const digit = solvedDigit ?? (step?.letter === ch ? step?.digit : undefined)
  let bg = 'bg-white/20'
  if (status === 'trying') bg = 'bg-yellow-500'
  if (status === 'backtrack') bg = 'bg-red-500'
  if (status === 'success' || solvedDigit != null) bg = 'bg-green-600'
  return (
    <Motion.div
      animate={{ scale: status ? [1, 1.1, 1] : 1 }}
      transition={{ duration: 0.3 }}
      className={`w-10 h-10 rounded flex items-center justify-center text-white ${bg}`}
    >
      <div className="text-sm">{digit != null ? digit : ch}</div>
    </Motion.div>
  )
}

export default function CryptarithmeticScreen() {
  const [w1, setW1] = useState('SEND')
  const [w2, setW2] = useState('MORE')
  const [rw, setRW] = useState('MONEY')
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [error, setError] = useState('')
  const [solution, setSolution] = useState(null)

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

  function presetSendMore() {
    setW1('SEND')
    setW2('MORE')
    setRW('MONEY')
    resetPlayback()
  }
  function presetBaseBall() {
    setW1('BASE')
    setW2('BALL')
    setRW('GAMES')
    resetPlayback()
  }

  function solve() {
    if (![w1, w2, rw].every((x) => /^[A-Za-z]{1,8}$/.test(x))) {
      setError('Invalid words. Use letters only, max 8 chars.')
      return
    }
    const res = cryptSolve(w1, w2, rw)
    setSteps(res.steps)
    setSolution(res.solution)
    setCurrentStep(0)
    setIsPlaying(false)
    if (!res.solution) setError('No valid assignment found')
    else setError('')
  }

  function resetPlayback() {
    setSteps([])
    setCurrentStep(0)
    setIsPlaying(false)
    setError('')
    setSolution(null)
  }

  const s = steps[currentStep]
  const letters = Array.from(new Set((w1 + w2 + rw).toUpperCase()))

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Panel: Controls */}
      <div className="w-full lg:w-96 p-6 space-y-8 bg-slate-900/50 backdrop-blur-xl border-r border-white/5">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-purple-400 mb-6">Cipher Solver</h2>
          
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Presets</label>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={presetSendMore}
                className="px-4 py-3 rounded-xl text-left font-bold transition-all bg-white/5 text-slate-400 hover:bg-white/10"
              >
                SEND + MORE = MONEY
              </button>
              <button
                onClick={presetBaseBall}
                className="px-4 py-3 rounded-xl text-left font-bold transition-all bg-white/5 text-slate-400 hover:bg-white/10"
              >
                BASE + BALL = GAMES
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Puzzle Inputs</label>
          <div className="space-y-3">
            <input
              value={w1}
              onChange={(e) => setW1(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8))}
              placeholder="Word 1"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 transition-all font-bold"
            />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-500">+</span>
              <input
                value={w2}
                onChange={(e) => setW2(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8))}
                placeholder="Word 2"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 transition-all font-bold"
              />
            </div>
            <div className="h-[2px] bg-slate-800" />
            <input
              value={rw}
              onChange={(e) => setRW(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8))}
              placeholder="Result Word"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 transition-all font-bold"
            />
          </div>
        </div>

        <button
          onClick={solve}
          className="w-full py-4 text-lg bg-purple-600 hover:bg-purple-500 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]"
        >
          CRACK THE CODE
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

      {/* Main Content: Solver View & Controls */}
      <div className="flex-1 flex flex-col p-6 lg:p-10 space-y-6 overflow-hidden">
        <div className="flex-1 glass-dark rounded-3xl relative overflow-hidden group border border-white/5 flex flex-col items-center justify-center p-8">
          <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative space-y-8 max-w-2xl w-full">
            {/* Addition UI */}
            <div className="flex flex-col items-end gap-2 pr-12">
              <div className="flex gap-2">
                {w1.toUpperCase().split('').map((ch, i) => <LetterBox key={i} ch={ch} step={s} solvedDigit={solution?.[ch]} />)}
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-3xl font-black text-slate-600 mr-2">+</span>
                {w2.toUpperCase().split('').map((ch, i) => <LetterBox key={i} ch={ch} step={s} solvedDigit={solution?.[ch]} />)}
              </div>
              <div className="w-full h-1 bg-slate-700 rounded-full my-2" />
              <div className="flex gap-2">
                {rw.toUpperCase().split('').map((ch, i) => <LetterBox key={i} ch={ch} step={s} solvedDigit={solution?.[ch]} />)}
              </div>
            </div>

            {/* Digit Tracker */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
              {Array.from({ length: 10 }).map((_, d) => {
                const assignedLetter = letters.find((L) => solution?.[L] === d)
                const active = s?.assignments && Object.values(s.assignments).includes(d)
                return (
                  <Motion.div
                    key={d}
                    animate={{ 
                      scale: active ? 1.1 : 1,
                      borderColor: active ? '#a855f7' : '#1e293b'
                    }}
                    className={`h-12 flex flex-col items-center justify-center rounded-lg border-2 bg-slate-900/50 transition-all ${assignedLetter ? 'bg-purple-500/20 border-purple-500/50' : ''}`}
                  >
                    <span className="text-[10px] font-black text-slate-500">{d}</span>
                    <span className="text-lg font-black text-white">{assignedLetter || '-'}</span>
                  </Motion.div>
                )
              })}
            </div>

            {/* Final Solution Equation */}
            {solution && (
              <Motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-6 bg-green-500/10 border border-green-500/30 rounded-2xl"
              >
                <div className="text-3xl font-black text-green-400 tracking-widest">
                  {toNum(w1, solution)} + {toNum(w2, solution)} = {toNum(rw, solution)}
                </div>
              </Motion.div>
            )}
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
