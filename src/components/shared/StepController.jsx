import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'

export default function StepController({
  steps,
  currentStep,
  onStepChange,
  isPlaying,
  onPlay,
  onPause,
  onReset,
  speed,
  onSpeedChange,
}) {
  const total = steps?.length || 0
  const s = steps?.[currentStep] || {}
  const label = buildLabel(currentStep, total, s)
  return (
    <div className="glass-dark rounded-2xl p-6 shadow-2xl border border-white/10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Progress Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="text-sm font-black uppercase tracking-widest text-blue-400 mb-1">
            Step {total > 0 ? currentStep + 1 : 0} / {total}
          </div>
          <div className="text-lg font-bold text-white truncate max-w-xs md:max-w-md">
            {label}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onReset} 
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all active:scale-90"
            title="Reset"
          >
            <RotateCcw size={20} />
          </button>
          
          <div className="h-8 w-[1px] bg-white/10 mx-2" />

          <button 
            onClick={() => onStepChange(Math.max(0, currentStep - 1))} 
            disabled={currentStep === 0}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>

          <button 
            onClick={isPlaying ? onPause : onPlay} 
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all active:scale-90"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="ml-1" fill="currentColor" />}
          </button>

          <button 
            onClick={() => onStepChange(Math.min(total - 1, currentStep + 1))} 
            disabled={currentStep >= total - 1}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-all active:scale-90"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex-1 w-full md:w-auto flex flex-col gap-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>Slow</span>
            <span>Speed: {speed}x</span>
            <span>Fast</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>
    </div>
  )
}

function buildLabel(current, total, s) {
  if (!total) return 'No steps'
  if (s.current && s.queue) {
    return `Step ${current + 1} / ${total} — Visiting node ${s.current} | Queue: [${s.queue.join(', ')}]`
  }
  if (s.current && s.stack) {
    return `Step ${current + 1} / ${total} — Visiting node ${s.current} | Stack: [${s.stack.join(', ')}]`
  }
  if (s.mLeft != null) {
    const dir = s.boatOnLeft ? 'Boat ←' : 'Boat →'
    return `Step ${current + 1} / ${total} — Left: ${s.mLeft}M ${s.cLeft}C | Right: ${s.mRight}M ${s.cRight}C | ${dir}`
  }
  if (s.letter) {
    return `Step ${current + 1} / ${total} — ${s.status} ${s.letter}=${s.digit}`
  }
  return `Step ${current + 1} / ${total}`
}
