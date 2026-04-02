export function bfsSolve(graph, startNode, targetNode) {
  const nodes = new Set(graph.nodes)
  if (!nodes.has(startNode) || !nodes.has(targetNode)) return { steps: [], finalPath: null }
  const queue = [startNode]
  const visited = new Set([startNode])
  const parent = new Map()
  const steps = []
  while (queue.length) {
    const current = queue.shift()
    const path = reconstructPath(parent, startNode, current, current === targetNode)
    steps.push({
      current,
      queue: [...queue],
      visited: [...visited],
      path,
    })
    if (current === targetNode) {
      const finalPath = reconstructPath(parent, startNode, targetNode, true)
      return { steps, finalPath }
    }
    const neighbors = getNeighbors(graph, current)
    for (const n of neighbors) {
      if (!visited.has(n)) {
        visited.add(n)
        parent.set(n, current)
        queue.push(n)
      }
    }
  }
  return { steps, finalPath: null }
}

export function dfsSolve(graph, startNode, targetNode) {
  const nodes = new Set(graph.nodes)
  if (!nodes.has(startNode) || !nodes.has(targetNode)) return { steps: [], finalPath: null }
  const stack = [startNode]
  const visited = new Set()
  const parent = new Map()
  const steps = []
  while (stack.length) {
    const current = stack.pop()
    if (visited.has(current)) continue
    visited.add(current)
    const path = reconstructPath(parent, startNode, current, current === targetNode)
    steps.push({
      current,
      stack: [...stack],
      visited: [...visited],
      path,
    })
    if (current === targetNode) {
      const finalPath = reconstructPath(parent, startNode, targetNode, true)
      return { steps, finalPath }
    }
    const neighbors = getNeighbors(graph, current)
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const n = neighbors[i]
      if (!visited.has(n)) {
        if (!parent.has(n)) parent.set(n, current)
        stack.push(n)
      }
    }
  }
  return { steps, finalPath: null }
}

function getNeighbors(graph, node) {
  const neighbors = []
  for (const [a, b] of graph.edges) {
    if (a === node) neighbors.push(b)
    else if (b === node) neighbors.push(a)
  }
  return neighbors
}

function reconstructPath(parent, start, current, requireTarget) {
  if (requireTarget && current == null) return []
  const path = []
  let n = current
  while (n != null) {
    path.push(n)
    if (n === start) break
    n = parent.get(n)
    if (n == null) break
  }
  path.reverse()
  if (path[0] !== start) return []
  return path
}

export function missionariesSolve(mTotal = 3, cTotal = 3, boatCapacity = 2) {
  const start = { mLeft: mTotal, cLeft: cTotal, boatOnLeft: true }
  const goalKey = keyOf({ mLeft: 0, cLeft: 0, boatOnLeft: false })
  const q = [start]
  const visited = new Set([keyOf(start)])
  const parent = new Map()
  const moveMap = new Map()
  const steps = []
  while (q.length) {
    const s = q.shift()
    const mRight = mTotal - s.mLeft
    const cRight = cTotal - s.cLeft
    const stateValid = isValidState(s.mLeft, s.cLeft, mRight, cRight)
    steps.push({
      mLeft: s.mLeft,
      cLeft: s.cLeft,
      mRight,
      cRight,
      boatOnLeft: s.boatOnLeft,
      move: moveMap.get(keyOf(s)) || { m: 0, c: 0 },
      isValid: stateValid,
    })
    if (keyOf(s) === goalKey) {
      const pathStates = []
      let curKey = keyOf(s)
      while (curKey) {
        const st = parseKey(curKey)
        const mR = mTotal - st.mLeft
        const cR = cTotal - st.cLeft
        pathStates.push({
          mLeft: st.mLeft,
          cLeft: st.cLeft,
          mRight: mR,
          cRight: cR,
          boatOnLeft: st.boatOnLeft,
          move: moveMap.get(curKey) || { m: 0, c: 0 },
          isValid: isValidState(st.mLeft, st.cLeft, mR, cR),
        })
        curKey = parent.get(curKey)
      }
      pathStates.reverse()
      return pathStates
    }
    const moves = generateMoves(boatCapacity)
    for (const mv of moves) {
      const next = applyMove(s, mv)
      const mR = mTotal - next.mLeft
      const cR = cTotal - next.cLeft
      const valid = isValidState(next.mLeft, next.cLeft, mR, cR)
      if (!valid) {
        steps.push({
          mLeft: next.mLeft,
          cLeft: next.cLeft,
          mRight: mR,
          cRight: cR,
          boatOnLeft: next.boatOnLeft,
          move: mv,
          isValid: false,
        })
        continue
      }
      const k = keyOf(next)
      if (!visited.has(k)) {
        visited.add(k)
        parent.set(k, keyOf(s))
        moveMap.set(k, mv)
        q.push(next)
      }
    }
  }
  return []
}

function isValidState(mLeft, cLeft, mRight, cRight) {
  if (mLeft < 0 || cLeft < 0 || mRight < 0 || cRight < 0) return false
  if (!(mLeft === 0 || mLeft >= cLeft)) return false
  if (!(mRight === 0 || mRight >= cRight)) return false
  return true
}

function generateMoves(cap) {
  const res = []
  for (let m = 0; m <= cap; m++) {
    for (let c = 0; c <= cap; c++) {
      const sum = m + c
      if (sum >= 1 && sum <= cap) {
        if (m === 0 || m >= c) res.push({ m, c })
      }
    }
  }
  return res
}

function applyMove(state, mv) {
  if (state.boatOnLeft) {
    return {
      mLeft: state.mLeft - mv.m,
      cLeft: state.cLeft - mv.c,
      boatOnLeft: false,
    }
  }
  return {
    mLeft: state.mLeft + mv.m,
    cLeft: state.cLeft + mv.c,
    boatOnLeft: true,
  }
}

function keyOf(s) {
  return `${s.mLeft}|${s.cLeft}|${s.boatOnLeft ? 'L' : 'R'}`
}
function parseKey(k) {
  const parts = k.split('|')
  return { mLeft: +parts[0], cLeft: +parts[1], boatOnLeft: parts[2] === 'L' }
}

export function cryptSolve(word1, word2, resultWord) {
  const w1 = word1.toUpperCase()
  const w2 = word2.toUpperCase()
  const rw = resultWord.toUpperCase()
  if (!/^[A-Z]+$/.test(w1) || !/^[A-Z]+$/.test(w2) || !/^[A-Z]+$/.test(rw)) {
    return { steps: [], solution: null }
  }
  const letters = []
  const seen = new Set()
  for (const ch of w1 + w2 + rw) {
    if (!seen.has(ch)) {
      seen.add(ch)
      letters.push(ch)
    }
  }
  const leading = new Set([w1[0], w2[0], rw[0]])
  const steps = []
  const assign = {}
  const used = new Set()
  let recorded = 0
  const maxSteps = 500
  function toNum(word) {
    let v = 0
    for (const ch of word) {
      const d = assign[ch]
      if (d == null) return null
      v = v * 10 + d
    }
    return v
  }
  function backtrack(i) {
    if (i === letters.length) {
      const a = toNum(w1)
      const b = toNum(w2)
      const c = toNum(rw)
      if (a + b === c) return true
      return false
    }
    const L = letters[i]
    for (let d = 0; d <= 9; d++) {
      if (used.has(d)) continue
      if (leading.has(L) && d === 0) continue
      assign[L] = d
      used.add(d)
      if (recorded < maxSteps && i < letters.length) {
        steps.push({
          letter: L,
          digit: d,
          assignments: { ...assign },
          status: 'trying',
        })
        recorded++
      }
      if (backtrack(i + 1)) {
        if (recorded < maxSteps) {
          steps.push({
            letter: L,
            digit: d,
            assignments: { ...assign },
            status: 'success',
          })
          recorded++
        }
        return true
      }
      if (recorded < maxSteps) {
        steps.push({
          letter: L,
          digit: d,
          assignments: { ...assign },
          status: 'backtrack',
        })
        recorded++
      }
      used.delete(d)
      assign[L] = undefined
    }
    return false
  }
  const ok = backtrack(0)
  if (!ok) return { steps, solution: null }
  const solution = {}
  for (const l of letters) solution[l] = assign[l]
  return { steps, solution }
}
