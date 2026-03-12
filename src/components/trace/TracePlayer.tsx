'use client'

import { useEffect } from 'react'
import { useTraceStore, getCurrentStep } from '@/lib/store/trace-store'
import { CodePanel } from './CodePanel'
import { VariableWatch } from './VariableWatch'
import { StepControls } from './StepControls'
import { StepDescription } from './StepDescription'
import { ArrayVisualizer } from './visualizers/ArrayVisualizer'
import { HashMapVisualizer } from './visualizers/HashMapVisualizer'
import type { TraceData } from '@/types/trace'

interface TracePlayerProps {
  trace: TraceData
}

export function TracePlayer({ trace }: TracePlayerProps) {
  const {
    currentStep,
    isPlaying,
    speed,
    setTrace,
    nextStep,
    prevStep,
    setPlaying,
    setSpeed,
    setStep,
    reset,
  } = useTraceStore()

  useEffect(() => {
    setTrace(trace)
  }, [trace, setTrace])

  const step = getCurrentStep(trace, currentStep)
  const ds = step.dataStructure

  return (
    <div className="flex flex-col gap-4">
      {/* Step description banner */}
      <StepDescription
        description={step.description}
        stepNumber={step.stepNumber}
        operationType={step.operation?.type}
      />

      {/* Main two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: code panel */}
        <div className="space-y-3">
          <CodePanel
            code={trace.code}
            language={trace.language}
            activeLine={step.lineNumber}
          />
          <VariableWatch variables={step.variables} />
        </div>

        {/* Right: visualization */}
        <div className="rounded-xl border bg-card p-4 flex flex-col gap-4 min-h-64">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Visualization — {ds.type.replace('-', ' ')}
          </div>

          <div className="flex-1 flex items-center justify-center">
            <DataStructureView ds={ds} operation={step.operation} />
          </div>

          {/* Input / Output legend */}
          <div className="text-xs text-muted-foreground space-y-0.5 border-t pt-3">
            <div><span className="font-semibold">Input:</span> {trace.input}</div>
            <div><span className="font-semibold">Output:</span> {trace.output}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-xl border bg-card px-4 py-3">
        <StepControls
          currentStep={currentStep}
          totalSteps={trace.steps.length}
          isPlaying={isPlaying}
          speed={speed}
          onPrev={prevStep}
          onNext={nextStep}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onReset={reset}
          onSpeedChange={setSpeed}
          onStepChange={setStep}
        />
      </div>
    </div>
  )
}

function DataStructureView({
  ds,
  operation,
}: {
  ds: TraceData['steps'][number]['dataStructure']
  operation?: { type: string; indices?: number[]; description: string }
}) {
  switch (ds.type) {
    case 'array':
      return (
        <ArrayVisualizer
          state={ds.state as (string | number)[]}
          highlights={ds.highlights}
          pointers={ds.pointers}
          operation={operation}
        />
      )

    case 'hash-map':
      return (
        <HashMapVisualizer
          state={ds.state as Record<string, unknown>}
          highlights={ds.highlights}
          operation={operation}
        />
      )

    default:
      return (
        <div className="text-sm text-muted-foreground">
          Visualizer for <code className="font-mono">{ds.type}</code> coming soon.
        </div>
      )
  }
}
