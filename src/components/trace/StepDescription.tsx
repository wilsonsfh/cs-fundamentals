'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface StepDescriptionProps {
  description: string
  stepNumber: number
  operationType?: string
}

const OP_STYLES: Record<string, string> = {
  insert: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400',
  lookup: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
  return: 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400',
  swap:   'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400',
}

export function StepDescription({ description, stepNumber, operationType }: StepDescriptionProps) {
  const style = operationType ? OP_STYLES[operationType] : null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepNumber}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2 }}
        className={`rounded-lg border px-4 py-3 text-sm font-medium ${
          style ?? 'bg-card border-border text-foreground'
        }`}
      >
        {description}
      </motion.div>
    </AnimatePresence>
  )
}
