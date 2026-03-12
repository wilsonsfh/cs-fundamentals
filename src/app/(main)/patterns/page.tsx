import { getAllPatterns } from '@/lib/content'
import { PatternCard } from '@/components/patterns/PatternCard'

export default function PatternsPage() {
  const patterns = getAllPatterns()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Patterns</h1>
        <p className="text-muted-foreground mt-1">
          Pattern-first approach to DSA — learn the template, then solve problems.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {patterns.map((pattern) => (
          <PatternCard key={pattern.slug} pattern={pattern} />
        ))}
      </div>
    </div>
  )
}
