'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface VariableWatchProps {
  variables: Record<string, { value: string; changed: boolean }>
}

export function VariableWatch({ variables }: VariableWatchProps) {
  const entries = Object.entries(variables)

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Variables
      </h3>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {entries.map(([name, { value, changed }]) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: changed ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 0.25 }}
              className={cn(
                'flex items-baseline gap-1.5 px-2.5 py-1.5 rounded-md border font-mono text-xs transition-colors duration-300',
                changed
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'border-border bg-muted/50 text-foreground'
              )}
            >
              <span className="font-semibold text-muted-foreground">{name}</span>
              <span className="text-foreground">=</span>
              <span className={cn('font-bold', changed && 'text-amber-600 dark:text-amber-300')}>
                {value}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
