import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getProblemContent, getAllProblemSlugs, getPatternMeta } from '@/lib/content'
import { MarkdownRenderer } from '@/components/patterns/MarkdownRenderer'

export function generateStaticParams() {
  return getAllProblemSlugs().map(slug => {
    const problem = getProblemContent(slug)
    if (!problem) return null
    return {
      slug: problem.meta.patternSlug || 'unknown',
      problemSlug: slug,
    }
  }).filter(Boolean)
}

interface ProblemPageProps {
  params: Promise<{ slug: string; problemSlug: string }>
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { slug, problemSlug } = await params
  const problem = getProblemContent(problemSlug)

  if (!problem) notFound()

  const patternMeta = getPatternMeta(slug)
  const { meta, content } = problem

  // Extract sections from content (skip frontmatter)
  const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---\n*/, '')

  const difficultyColor: Record<string, string> = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/patterns/${slug}`}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{meta.name || problemSlug}</h1>
          <div className="flex items-center gap-2 mt-1">
            {patternMeta && (
              <Link href={`/patterns/${slug}`} className="text-sm text-muted-foreground hover:text-foreground">
                {patternMeta.title}
              </Link>
            )}
            {meta.difficulty && (
              <Badge variant="secondary" className={difficultyColor[meta.difficulty] || ''}>
                {meta.difficulty}
              </Badge>
            )}
            {meta.link && (
              <a href={meta.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                LeetCode
              </a>
            )}
          </div>
        </div>
      </div>

      <MarkdownRenderer content={contentWithoutFrontmatter} />
    </div>
  )
}
