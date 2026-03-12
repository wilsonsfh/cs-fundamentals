'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HashMapVisualizerProps {
  state: Record<string, unknown>
  highlights: number[]  // indices of recently accessed keys
  operation?: { type: string; description: string }
}

export function HashMapVisualizer({ state, highlights, operation }: HashMapVisualizerProps) {
  const entries = Object.entries(state)
  const highlightSet = new Set(highlights)

  const isInsert = operation?.type === 'insert'
  const isLookup = operation?.type === 'lookup'
  const isFound = isLookup && operation?.description?.includes('FOUND')

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
        Hash Map
      </div>

      {entries.length === 0 ? (
        <div className="flex items-center justify-center h-16 rounded-lg border border-dashed border-border">
          <span className="text-sm text-muted-foreground font-mono">{'{ }'}</span>
        </div>
      ) : (
        <div className="space-y-1.5">
          <AnimatePresence>
            {entries.map(([key, value], i) => {
              const isHighlighted = highlightSet.has(i)
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -12, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: isHighlighted ? [1, 1.04, 1] : 1,
                  }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    'flex items-center gap-0 rounded-md border overflow-hidden font-mono text-sm transition-colors duration-200',
                    isHighlighted && isFound
                      ? 'border-green-500 shadow-sm shadow-green-500/20'
                      : isHighlighted && isInsert
                      ? 'border-blue-500 shadow-sm shadow-blue-500/20'
                      : isHighlighted
                      ? 'border-amber-500 shadow-sm shadow-amber-500/20'
                      : 'border-border'
                  )}
                >
                  {/* Key cell */}
                  <div
                    className={cn(
                      'px-4 py-2 font-bold border-r',
                      isHighlighted && isFound
                        ? 'bg-green-500/20 border-green-500 text-green-600 dark:text-green-400'
                        : isHighlighted && isInsert
                        ? 'bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400'
                        : isHighlighted
                        ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400'
                        : 'bg-muted border-border text-foreground'
                    )}
                  >
                    {key}
                  </div>
                  {/* Arrow */}
                  <div className="px-2 text-muted-foreground">→</div>
                  {/* Value cell */}
                  <div
                    className={cn(
                      'px-4 py-2 flex-1',
                      isHighlighted && isFound
                        ? 'text-green-600 dark:text-green-400'
                        : isHighlighted
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {String(value)}
                  </div>
                  {/* Operation badge */}
                  {isHighlighted && (
                    <div
                      className={cn(
                        'px-2 py-1 text-xs font-bold text-white mr-2 rounded',
                        isFound ? 'bg-green-500' : isInsert ? 'bg-blue-500' : 'bg-amber-500'
                      )}
                    >
                      {isFound ? 'HIT' : isInsert ? 'NEW' : 'GET'}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {operation && (
        <p className="text-xs text-muted-foreground mt-1 italic">{operation.description}</p>
      )}
    </div>
  )
}
