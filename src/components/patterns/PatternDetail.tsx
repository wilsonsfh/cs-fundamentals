'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MarkdownRenderer } from './MarkdownRenderer'
import { ProblemsTable } from './ProblemsTable'
import type { PatternMeta } from '@/types/content'
import type { TraceData } from '@/types/trace'
import { Play } from 'lucide-react'

interface PatternDetailProps {
  meta: PatternMeta
  sections: Record<string, string>
  problems: Array<{ slug: string; name: string; difficulty: string; patternSlug: string }>
  traces?: Pick<TraceData, 'slug' | 'title' | 'steps'>[]
}

export function PatternDetail({ meta, sections, problems, traces = [] }: PatternDetailProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const sectionMap = {
    overview: ['When to Use'],
    templates: ['Template'],
    gotchas: ['My Gotchas'],
    problems: ['Key Problems'],
    flashcards: ['Flashcards'],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/patterns"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{meta.title}</h1>
          <p className="text-sm text-muted-foreground">{meta.description}</p>
        </div>
        {meta.problemCount > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {meta.problemCount} problems
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="gotchas">Gotchas</TabsTrigger>
          <TabsTrigger value="problems">Problems</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
        </TabsList>

        {Object.entries(sectionMap).map(([tab, sectionNames]) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            {tab === 'problems' ? (
              <div className="space-y-6">
                {sections['Key Problems'] && (
                  <MarkdownRenderer content={sections['Key Problems']} />
                )}
                {problems.length > 0 && (
                  <ProblemsTable problems={problems} patternSlug={meta.slug} />
                )}
                {traces.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Interactive Traces</h3>
                    <div className="flex flex-col gap-2">
                      {traces.map(trace => (
                        <Link
                          key={trace.slug}
                          href={`/trace/${trace.slug}`}
                          className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/50 hover:bg-accent/50 transition-colors group"
                        >
                          <div className="p-1.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Play className="h-3.5 w-3.5 text-primary ml-0.5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{trace.title}</p>
                            <p className="text-xs text-muted-foreground">{trace.steps.length} steps</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              sectionNames.map(name => (
                sections[name] ? (
                  <MarkdownRenderer key={name} content={sections[name]} />
                ) : (
                  <p key={name} className="text-muted-foreground text-sm">No content yet.</p>
                )
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
