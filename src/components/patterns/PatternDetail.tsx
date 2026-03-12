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

interface PatternDetailProps {
  meta: PatternMeta
  sections: Record<string, string>
  problems: Array<{ slug: string; name: string; difficulty: string; patternSlug: string }>
}

export function PatternDetail({ meta, sections, problems }: PatternDetailProps) {
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
