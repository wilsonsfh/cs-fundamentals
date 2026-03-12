'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import hljs from 'highlight.js/lib/core'
import python from 'highlight.js/lib/languages/python'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import 'highlight.js/styles/github-dark-dimmed.css'

hljs.registerLanguage('python', python)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)

interface CodePanelProps {
  code: string
  language: string
  activeLine: number  // 1-based line number
}

export function CodePanel({ code, language, activeLine }: CodePanelProps) {
  const codeRef = useRef<HTMLElement>(null)
  const lines = code.split('\n')

  useEffect(() => {
    if (codeRef.current) {
      delete codeRef.current.dataset.highlighted
      hljs.highlightElement(codeRef.current)
    }
  }, [code, language])

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#1e2030] text-sm font-mono">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-[#161829]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-xs text-zinc-400 ml-2">
          {language === 'python' ? 'solution.py' : language === 'typescript' ? 'solution.ts' : 'solution.js'}
        </span>
      </div>

      {/* Code lines with active line highlight */}
      <div className="relative overflow-auto max-h-80">
        {lines.map((line, i) => {
          const lineNum = i + 1
          const isActive = lineNum === activeLine
          return (
            <div key={i} className="relative flex">
              {/* Active line highlight */}
              {isActive && (
                <motion.div
                  layoutId="active-line"
                  className="absolute inset-0 bg-amber-500/15 border-l-2 border-amber-400 pointer-events-none"
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              )}
              {/* Line number */}
              <span
                className={`select-none w-10 shrink-0 text-right pr-4 py-0.5 text-xs transition-colors ${
                  isActive ? 'text-amber-400 font-bold' : 'text-zinc-600'
                }`}
              >
                {lineNum}
              </span>
              {/* Line content */}
              <span
                className={`flex-1 py-0.5 pr-4 whitespace-pre ${
                  isActive ? 'text-zinc-100' : 'text-zinc-400'
                }`}
              >
                {line || ' '}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
