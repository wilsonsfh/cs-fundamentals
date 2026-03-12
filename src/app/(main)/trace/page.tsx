import { Card, CardContent } from '@/components/ui/card'
import { Network } from 'lucide-react'

export default function TracePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Algorithm Tracer</h1>
        <p className="text-muted-foreground mt-1">
          Step through algorithm execution with visual data structure animations.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center text-center py-16 space-y-4">
          <Network className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">Coming in Phase 2</h2>
          <p className="text-muted-foreground max-w-md">
            Interactive algorithm tracing with custom SVG visualizations for arrays, trees, graphs, and more.
            Step through Two Sum, Binary Search, BFS, Merge Sort, and Sliding Window.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
