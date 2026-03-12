import { create } from 'zustand'
import type { TraceData, TraceStep } from '@/types/trace'

interface TraceState {
  trace: TraceData | null
  currentStep: number
  isPlaying: boolean
  speed: number // ms per step: 2000, 1000, 500, 250
  setTrace: (trace: TraceData) => void
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setPlaying: (playing: boolean) => void
  setSpeed: (speed: number) => void
  reset: () => void
}

export const useTraceStore = create<TraceState>((set, get) => ({
  trace: null,
  currentStep: 0,
  isPlaying: false,
  speed: 1000,

  setTrace: (trace) => set({ trace, currentStep: 0, isPlaying: false }),

  setStep: (step) => {
    const { trace } = get()
    if (!trace) return
    const clamped = Math.max(0, Math.min(step, trace.steps.length - 1))
    set({ currentStep: clamped })
  },

  nextStep: () => {
    const { trace, currentStep } = get()
    if (!trace) return
    if (currentStep < trace.steps.length - 1) {
      set({ currentStep: currentStep + 1 })
    } else {
      set({ isPlaying: false })
    }
  },

  prevStep: () => {
    const { currentStep } = get()
    if (currentStep > 0) set({ currentStep: currentStep - 1 })
  },

  setPlaying: (isPlaying) => set({ isPlaying }),
  setSpeed: (speed) => set({ speed }),
  reset: () => set({ currentStep: 0, isPlaying: false }),
}))

export function getCurrentStep(trace: TraceData, stepIndex: number): TraceStep {
  return trace.steps[Math.min(stepIndex, trace.steps.length - 1)]
}
