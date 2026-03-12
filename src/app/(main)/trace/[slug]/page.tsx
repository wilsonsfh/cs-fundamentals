import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getAllTraceSlugs, getTraceData, getPatternMeta } from '@/lib/content'
import { TracePlayer } from '@/components/trace/TracePlayer'

export function generateStaticParams() {
  return getAllTraceSlugs().map(slug => ({ slug }))
}

interface TracePageProps {
  params: Promise<{ slug: string }>
}

export default async function TraceDetailPage({ params }: TracePageProps) {
  const { slug } = await params
  const trace = getTraceData(slug)
  if (!trace) notFound()

  const patternMeta = getPatternMeta(trace.patternSlug)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/trace"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold">{trace.title}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {patternMeta && (
              <Link
                href={`/patterns/${trace.patternSlug}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {patternMeta.title}
              </Link>
            )}
            <Badge variant="secondary" className="font-mono text-xs">{trace.language}</Badge>
            <Badge variant="outline" className="text-xs">{trace.steps.length} steps</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{trace.description}</p>
        </div>
      </div>

      {/* Player */}
      <TracePlayer trace={trace} />
    </div>
  )
}
