'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { SkipBack, SkipForward, Play, Pause, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepControlsProps {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  speed: number
  onPrev: () => void
  onNext: () => void
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onSpeedChange: (speed: number) => void
  onStepChange: (step: number) => void
}

const SPEEDS = [
  { label: '0.5×', ms: 2000 },
  { label: '1×',   ms: 1000 },
  { label: '2×',   ms: 500 },
  { label: '4×',   ms: 250 },
]

export function StepControls({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPrev,
  onNext,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onStepChange,
}: StepControlsProps) {
  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      onNext()
    }, speed)
    return () => clearInterval(timer)
  }, [isPlaying, speed, onNext])

  return (
    <div className="space-y-3">
      {/* Progress bar / scrubber */}
      <div className="relative">
        <input
          type="range"
          min={0}
          max={totalSteps - 1}
          value={currentStep}
          onChange={e => onStepChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-muted accent-primary"
        />
        {/* Step dots */}
        <div className="flex justify-between mt-1">
          {Array.from({ length: Math.min(totalSteps, 20) }).map((_, i) => {
            const stepIdx = Math.round((i / (Math.min(totalSteps, 20) - 1)) * (totalSteps - 1))
            return (
              <button
                key={i}
                onClick={() => onStepChange(stepIdx)}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-colors',
                  stepIdx <= currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
              />
            )
          })}
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: reset */}
        <Button variant="ghost" size="icon" onClick={onReset} className="h-8 w-8">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>

        {/* Center: prev / play-pause / next */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrev}
            disabled={currentStep === 0}
            className="h-9 w-9"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            onClick={isPlaying ? onPause : onPlay}
            disabled={currentStep === totalSteps - 1 && !isPlaying}
            className="h-10 w-10 rounded-full"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            disabled={currentStep === totalSteps - 1}
            className="h-9 w-9"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Right: speed + step counter */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-md overflow-hidden border">
            {SPEEDS.map(({ label, ms }) => (
              <button
                key={ms}
                onClick={() => onSpeedChange(ms)}
                className={cn(
                  'px-2 py-1 text-xs font-mono transition-colors',
                  speed === ms
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:bg-accent'
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-mono tabular-nums w-14 text-right">
            {currentStep + 1}/{totalSteps}
          </span>
        </div>
      </div>
    </div>
  )
}
