'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ArrayVisualizerProps {
  state: (string | number)[]
  highlights: number[]
  pointers: Record<string, number>
  operation?: { type: string; indices?: number[]; description: string }
}

const POINTER_LABEL_COLORS: Record<string, string> = {
  i:     'bg-blue-500',
  j:     'bg-purple-500',
  lo:    'bg-emerald-500',
  hi:    'bg-red-500',
  mid:   'bg-amber-500',
  left:  'bg-sky-500',
  right: 'bg-orange-500',
  slow:  'bg-teal-500',
  fast:  'bg-pink-500',
}

function getDefaultLabelColor(name: string) {
  const colors = ['bg-violet-500', 'bg-rose-500', 'bg-cyan-500', 'bg-lime-500']
  const idx = name.charCodeAt(0) % colors.length
  return colors[idx]
}

export function ArrayVisualizer({ state, highlights, pointers, operation }: ArrayVisualizerProps) {
  const highlightSet = new Set(highlights)

  // Group pointers by cell index (multiple pointers can point to same cell)
  const pointersByIndex: Record<number, string[]> = {}
  for (const [name, idx] of Object.entries(pointers)) {
    if (!pointersByIndex[idx]) pointersByIndex[idx] = []
    pointersByIndex[idx].push(name)
  }

  const isSwap = operation?.type === 'swap'
  const swapIndices = new Set(isSwap ? (operation?.indices ?? []) : [])

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Index labels */}
      <div className="flex gap-1">
        {state.map((_, i) => (
          <div key={i} className="w-12 text-center text-xs text-muted-foreground font-mono">
            {i}
          </div>
        ))}
      </div>

      {/* Array cells */}
      <div className="flex gap-1">
        <AnimatePresence mode="popLayout">
          {state.map((val, i) => {
            const isHighlighted = highlightSet.has(i)
            const isSwapCell = swapIndices.has(i)
            return (
              <motion.div
                key={`cell-${i}`}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: isSwapCell ? [1, 1.15, 1] : 1,
                  opacity: 1,
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'w-12 h-12 flex items-center justify-center rounded-md border-2 font-mono font-semibold text-sm transition-colors duration-300',
                  isHighlighted
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border text-foreground'
                )}
              >
                {String(val)}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Pointer arrows + labels */}
      {Object.keys(pointersByIndex).length > 0 && (
        <div className="flex gap-1 relative">
          {state.map((_, i) => {
            const names = pointersByIndex[i]
            if (!names || names.length === 0) {
              return <div key={i} className="w-12 h-8" />
            }
            return (
              <div key={i} className="w-12 flex flex-col items-center gap-0.5">
                {/* Arrow */}
                <div className="text-muted-foreground text-xs">↑</div>
                {/* Labels */}
                {names.map(name => (
                  <motion.span
                    key={name}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'text-xs font-mono font-bold px-1.5 py-0.5 rounded text-white',
                      POINTER_LABEL_COLORS[name] ?? getDefaultLabelColor(name)
                    )}
                  >
                    {name}
                  </motion.span>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
