import { notFound } from 'next/navigation'
import { getAllPatternSlugs, getPatternMeta, getPatternContent, parsePatternSections, getProblemsForPattern } from '@/lib/content'
import { PatternDetail } from '@/components/patterns/PatternDetail'

export function generateStaticParams() {
  return getAllPatternSlugs().map(slug => ({ slug }))
}

interface PatternPageProps {
  params: Promise<{ slug: string }>
}

export default async function PatternPage({ params }: PatternPageProps) {
  const { slug } = await params
  const meta = getPatternMeta(slug)
  const content = getPatternContent(slug)

  if (!meta || !content) notFound()

  const sections = parsePatternSections(content)
  const problems = getProblemsForPattern(slug)

  return (
    <PatternDetail
      meta={meta}
      sections={sections}
      problems={problems}
    />
  )
}
