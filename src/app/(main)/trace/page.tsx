import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getAllTraces } from '@/lib/content'
import { getAllPatterns } from '@/lib/content'
import { Play } from 'lucide-react'

export default function TracePage() {
  const traces = getAllTraces()
  const patterns = getAllPatterns()
  const patternMap = Object.fromEntries(patterns.map(p => [p.slug, p.title]))

  // Group traces by pattern
  const grouped: Record<string, typeof traces> = {}
  for (const trace of traces) {
    const key = trace.patternSlug || 'other'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(trace)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Algorithm Tracer</h1>
        <p className="text-muted-foreground mt-1">
          Step through algorithm execution with animated data structure visualizations.
        </p>
      </div>

      {Object.entries(grouped).map(([patternSlug, traceList]) => (
        <div key={patternSlug} className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {patternMap[patternSlug] || patternSlug}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {traceList.map(trace => (
              <Link key={trace.slug} href={`/trace/${trace.slug}`}>
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
                    <CardTitle className="text-base">{trace.title}</CardTitle>
                    <div className="p-1.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                      <Play className="h-3.5 w-3.5 text-primary ml-0.5" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{trace.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs font-mono">
                        {trace.language}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {trace.steps.length} steps
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      <span className="font-semibold">Input:</span> {trace.input}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
