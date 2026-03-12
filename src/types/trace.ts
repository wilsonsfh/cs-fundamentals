export interface TraceStep {
  stepNumber: number
  lineNumber: number
  description: string
  variables: Record<string, { value: string; changed: boolean }>
  dataStructure: {
    type: 'array' | 'linked-list' | 'tree' | 'hash-map' | 'graph' | 'matrix' | 'stack'
    state: unknown
    highlights: number[]
    pointers: Record<string, number>
  }
  callStack?: { frames: Array<{ name: string; args: string; returnValue?: string }> }
  operation?: { type: string; indices?: number[]; description: string }
}

export interface TraceData {
  slug: string
  title: string
  description: string
  patternSlug: string
  language: string
  code: string
  input: string
  output: string
  steps: TraceStep[]
}
