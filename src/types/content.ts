export interface PatternMeta {
  slug: string
  title: string
  description: string
  icon: string
  problemCount: number
}

export interface PatternContent {
  meta: PatternMeta
  whenToUse: string
  codeTemplates: string
  gotchas: string
  keyProblems: ProblemEntry[]
  flashcards: FlashcardEntry[]
  notes: string
  rawContent: string
}

export interface ProblemEntry {
  slug: string
  name: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  keyInsight: string
  link: string
  patternSlug: string
}

export interface ProblemContent {
  meta: {
    slug: string
    name: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
    patternSlug: string
    link: string
  }
  solution: string
  approach: string
  keyInsight: string
  failedApproaches: string
  timeComplexity: string
  spaceComplexity: string
  rawContent: string
}

export interface FlashcardEntry {
  id: string
  front: string
  back: string
  source: string // pattern slug
  category: CardCategory
}

export type CardCategory = 'general' | 'code' | 'data_structures' | 'algorithms'
