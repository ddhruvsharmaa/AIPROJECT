import { useEffect, useMemo, useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import GraphCanvas from './shared/GraphCanvas.jsx'
import StepController from './shared/StepController.jsx'
import { dfsSolve } from '../utils/solvers.js'

const PRESETS = {
  Simple: { nodes: ['A', 'B', 'C', 'D'], edges: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['A', 'D']] },
  Grid: { nodes: ['A', 'B', 'C', 'D', 'E', 'F'], edges: [['A', 'B'], ['B', 'C'], ['D', 'E'], ['E', 'F'], ['B', 'E'], ['C', 'F']] },
  Branch: { nodes: ['A', 'B', 'C', 'D', 'E'], edges: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'E']] },
}

function parseEdges(input) {
  const parts = input.split(',').map((s) => s.trim()).filter(Boolean)
  const edges = []
  for (const p of parts) {
    const [a, b] = p.split('-').map((s) => s.trim().toUpperCase())
    if (a && b && /^[A-Z]+$/.test(a) && /^[A-Z]+$/.test(b)) edges.push([a, b])
  }
  const nodes = Array.from(new Set(edges.flat()))
  return { nodes, edges }
}

export default function DFSScreen() {
  const [graph, setGraph] = useState(PRESETS.Simple)
  const [manualInput, setManualInput] = useState('')
  const [startNode, setStartNode] = useState('A')
  const [targetNode, setTargetNode] = useState('D')
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

  function applyPreset(name) {
    const g = PRESETS[name]
    setGraph(g)
    setStartNode(g.nodes[0] || '')
    setTargetNode(g.nodes[g.nodes.length - 1] || '')
    resetPlayback()
  }

  function useManual() {
    const g = parseEdges(manualInput)
    setGraph(g)
    setStartNode(g.nodes[0] || '')
    setTargetNode(g.nodes[g.nodes.length - 1] || '')
    resetPlayback()
  }

  function solve() {
    const res = dfsSolve(graph, startNode, targetNode)
    setSteps(res.steps)
    setCurrentStep(0)
    setIsPlaying(false)
    if (!res.finalPath) setError(`No path exists between ${startNode} and ${targetNode}`)
    else setError('')
  }

  function resetPlayback() {
    setSteps([])
    setCurrentStep(0)
    setIsPlaying(false)
    setError('')
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Panel: Controls */}
      <div className="w-full lg:w-96 p-6 space-y-8 bg-slate-900/50 backdrop-blur-xl border-r border-white/5">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-green-400 mb-6">DFS Explorer</h2>
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Presets</label>
            <div className="grid grid-cols-1 gap-2">
              {Object.keys(PRESETS).map(k => (
                <button
                  key={k}
                  onClick={() => applyPreset(k)}
                  className={`px-4 py-3 rounded-xl text-left font-bold transition-all ${graph === PRESETS[k] ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Manual Edges</label>
          <div className="flex gap-2">
            <input
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="A-B, B-C"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500/50 transition-all font-medium"
            />
            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl font-bold" onClick={useManual}>
              Use
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Start</label>
            <select
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500/50"
            >
              {graph.nodes.map(n => <option key={n} value={n} className="bg-slate-900">{n}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Target</label>
            <select
              value={targetNode}
              onChange={(e) => setTargetNode(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500/50"
            >
              {graph.nodes.map(n => <option key={n} value={n} className="bg-slate-900">{n}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={solve}
          className="w-full py-4 text-lg bg-green-600 hover:bg-green-500 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
        >
          EXECUTE DFS
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

      {/* Main Content: Canvas & Controls */}
      <div className="flex-1 flex flex-col p-6 lg:p-10 space-y-6 overflow-hidden">
        <div className="flex-1 bg-slate-900/50 backdrop-blur rounded-3xl relative overflow-hidden group border border-white/5">
          <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <GraphCanvas
            nodes={graph.nodes}
            edges={graph.edges}
            current={steps[currentStep]?.current}
            visited={steps[currentStep]?.visited}
            stack={steps[currentStep]?.stack}
            path={steps[currentStep]?.path}
            type="DFS"
          />
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
