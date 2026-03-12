import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MoveHorizontal, ArrowLeftRight, Search, GitBranch, Grid3x3,
  Undo2, Layers, GanttChart, Hash, Type, ArrowRightLeft,
} from 'lucide-react'
import type { PatternMeta } from '@/types/content'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MoveHorizontal, ArrowLeftRight, Search, GitBranch, Grid3x3,
  Undo2, Layers, GanttChart, Hash, Type, ArrowRightLeft,
}

interface PatternCardProps {
  pattern: PatternMeta
}

export function PatternCard({ pattern }: PatternCardProps) {
  const Icon = iconMap[pattern.icon] || Hash

  return (
    <Link href={`/patterns/${pattern.slug}`}>
      <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
        <CardHeader className="flex flex-row items-start gap-3 pb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base">{pattern.title}</CardTitle>
          </div>
          {pattern.problemCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {pattern.problemCount} problems
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{pattern.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
