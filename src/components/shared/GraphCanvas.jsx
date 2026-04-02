import { motion as Motion } from 'framer-motion'

export default function GraphCanvas({ nodes = [], edges = [], current, visited = [], queue = [], stack = [], path = [], type }) {
  const nodePos = computePositions(nodes)

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-950/40 rounded-3xl overflow-hidden">
      <svg viewBox="0 0 800 400" className="w-full h-full max-w-4xl p-10">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Edges */}
        {edges.map((e, i) => {
          const from = nodePos[e[0]]
          const to = nodePos[e[1]]
          if (!from || !to) return null
          const inPath = path?.includes(e[0]) && path?.includes(e[1])
          return (
            <Motion.line
              key={`${e[0]}-${e[1]}-${i}`}
              x1={from.x} y1={from.y}
              x2={to.x} y2={to.y}
              stroke={inPath ? (type === 'BFS' ? '#fbbf24' : '#a855f7') : '#1e293b'}
              strokeWidth={inPath ? 4 : 2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((n) => {
          const pos = nodePos[n]
          if (!pos) return null
          const isCurrent = current === n
          const isVisited = visited?.includes(n)
          const inQueue = queue?.includes(n)
          const inStack = stack?.includes(n)
          const inPath = path?.includes(n)

          let color = '#0f172a' // Default
          let stroke = '#1e293b'
          let textColor = '#475569'

          if (isCurrent) {
            color = type === 'BFS' ? '#06b6d4' : '#ef4444'
            stroke = '#fff'
            textColor = '#fff'
          } else if (inPath) {
            color = type === 'BFS' ? '#fbbf24' : '#a855f7'
            stroke = '#fff'
            textColor = '#fff'
          } else if (isVisited) {
            color = '#22c55e'
            stroke = '#166534'
            textColor = '#fff'
          } else if (inQueue) {
            color = '#f59e0b'
            stroke = '#92400e'
            textColor = '#fff'
          } else if (inStack) {
            color = '#f97316'
            stroke = '#9a3412'
            textColor = '#fff'
          }

          return (
            <Motion.g
              key={n}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              style={{ filter: isCurrent ? 'url(#glow)' : 'none' }}
            >
              <Motion.circle
                cx={pos.x}
                cy={pos.y}
                r={25}
                fill={color}
                stroke={stroke}
                strokeWidth={2}
                animate={isCurrent ? { r: [25, 30, 25] } : { r: 25 }}
                transition={isCurrent ? { repeat: Infinity, duration: 1 } : {}}
              />
              <text
                x={pos.x}
                y={pos.y}
                dy="0.35em"
                textAnchor="middle"
                fill={textColor}
                className="text-sm font-black select-none pointer-events-none"
              >
                {n}
              </text>
            </Motion.g>
          )
        })}
      </svg>
    </div>
  )
}

function computePositions(nodes) {
  const cx = 400
  const cy = 200
  const r = 150
  const pos = {}
  const count = nodes.length || 1
  nodes.forEach((n, i) => {
    const angle = (i / count) * Math.PI * 2
    pos[n] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  })
  return pos
}
