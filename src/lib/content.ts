import fs from 'fs'
import path from 'path'
import type { PatternMeta, FlashcardEntry } from '@/types/content'
import type { TraceData } from '@/types/trace'

const PATTERNS_DIR = path.join(process.cwd(), 'src/content/patterns')
const PROBLEMS_DIR = path.join(process.cwd(), 'src/content/problems')
const TRACES_DIR = path.join(process.cwd(), 'src/content/traces')

// Pattern metadata — defines order, descriptions, icons
const PATTERN_META: Record<string, Omit<PatternMeta, 'slug' | 'problemCount'>> = {
  'sliding-window': {
    title: 'Sliding Window',
    description: 'Find subarrays/substrings of variable or fixed size satisfying a condition',
    icon: 'MoveHorizontal',
  },
  'two-pointers': {
    title: 'Two Pointers',
    description: 'Sorted array pair/triplet sums, in-place removal, palindrome checks',
    icon: 'ArrowLeftRight',
  },
  'binary-search': {
    title: 'Binary Search',
    description: 'Search sorted arrays, answer spaces, and rotated arrays in O(log n)',
    icon: 'Search',
  },
  'dfs-bfs': {
    title: 'DFS / BFS',
    description: 'Graph/tree traversal, shortest paths, connected components, cycle detection',
    icon: 'GitBranch',
  },
  'dynamic-programming': {
    title: 'Dynamic Programming',
    description: 'Optimal substructure + overlapping subproblems — memoize or tabulate',
    icon: 'Grid3x3',
  },
  'backtracking': {
    title: 'Backtracking',
    description: 'Generate permutations, combinations, subsets with pruning',
    icon: 'Undo2',
  },
  'heap-priority-queue': {
    title: 'Heap / Priority Queue',
    description: 'K-th element, Top-K, merge K sorted, running median',
    icon: 'Layers',
  },
  'intervals': {
    title: 'Intervals',
    description: 'Merge, insert, schedule intervals — sort then sweep',
    icon: 'GanttChart',
  },
  'hash-map-set': {
    title: 'Hash Map / Set',
    description: 'Duplicate detection, frequency counting, complement lookup, grouping',
    icon: 'Hash',
  },
  'string-parsing': {
    title: 'String Parsing',
    description: 'Parse, convert, format, and extract from structured strings',
    icon: 'Type',
  },
  'prefix-suffix-arrays': {
    title: 'Prefix & Suffix Arrays',
    description: 'Precompute left/right answers for range queries and split problems',
    icon: 'ArrowRightLeft',
  },
}

export function getAllPatternSlugs(): string[] {
  return Object.keys(PATTERN_META)
}

export function getPatternMeta(slug: string): PatternMeta | null {
  const meta = PATTERN_META[slug]
  if (!meta) return null

  const problemCount = getProblemsForPattern(slug).length
  return { slug, ...meta, problemCount }
}

export function getAllPatterns(): PatternMeta[] {
  return getAllPatternSlugs().map(slug => getPatternMeta(slug)!).filter(Boolean)
}

export function getPatternContent(slug: string): string | null {
  const filePath = path.join(PATTERNS_DIR, `${slug}.md`)
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch {
    return null
  }
}

// Parse pattern markdown into sections
export function parsePatternSections(content: string) {
  const sections: Record<string, string> = {}
  let currentSection = ''
  const lines = content.split('\n')

  for (const line of lines) {
    const h2Match = line.match(/^## (.+)/)
    if (h2Match) {
      currentSection = h2Match[1].trim()
      sections[currentSection] = ''
    } else if (currentSection) {
      sections[currentSection] += line + '\n'
    }
  }

  // Trim trailing whitespace from each section
  for (const key of Object.keys(sections)) {
    sections[key] = sections[key].trim()
  }

  return sections
}

// Parse flashcards from pattern content
export function parseFlashcards(content: string, patternSlug: string): FlashcardEntry[] {
  const cards: FlashcardEntry[] = []
  const sections = parsePatternSections(content)
  const flashcardSection = sections['Flashcards']
  if (!flashcardSection) return cards

  const lines = flashcardSection.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    // Skip empty lines and SR metadata
    if (!line || line.startsWith('<!--SR:')) {
      i++
      continue
    }

    // Format 1: "Front :: Back"
    if (line.includes('::')) {
      const [front, back] = line.split('::').map(s => s.trim())
      if (front && back) {
        cards.push({
          id: `${patternSlug}-${cards.length}`,
          front: cleanFlashcardText(front),
          back: cleanFlashcardText(back),
          source: patternSlug,
          category: 'algorithms',
        })
      }
      i++
      continue
    }

    // Format 2: "Question?\nAnswer" (? at end of line)
    if (line.endsWith('?')) {
      const question = line
      let answer = ''
      i++

      // Skip the "?" separator line if present
      if (i < lines.length && lines[i].trim() === '?') {
        i++
      }

      // Collect answer lines until next empty line or next question
      while (i < lines.length) {
        const ansLine = lines[i].trim()
        if (!ansLine || ansLine.startsWith('<!--SR:')) {
          break
        }
        if (ansLine.endsWith('?') && !ansLine.includes('::')) {
          break
        }
        answer += (answer ? '\n' : '') + ansLine
        i++
      }

      if (question && answer) {
        cards.push({
          id: `${patternSlug}-${cards.length}`,
          front: cleanFlashcardText(question),
          back: cleanFlashcardText(answer),
          source: patternSlug,
          category: 'algorithms',
        })
      }
      continue
    }

    // Format 3: Statement with ==highlights== (cloze-like)
    if (line.includes('==') && !line.endsWith('?')) {
      const front = line.replace(/==([^=]+)==/g, '___')
      const back = line.replace(/==/g, '')
      cards.push({
        id: `${patternSlug}-${cards.length}`,
        front: cleanFlashcardText(front),
        back: cleanFlashcardText(back),
        source: patternSlug,
        category: 'algorithms',
      })
      i++
      continue
    }

    i++
  }

  return cards
}

function cleanFlashcardText(text: string): string {
  return text
    .replace(/<!--SR:.*?-->/g, '')
    .replace(/==/g, '')
    .replace(/``/g, '`')
    .trim()
}

// Problem file helpers
export function getProblemsForPattern(patternSlug: string): Array<{ slug: string; name: string; difficulty: string; patternSlug: string }> {
  if (!fs.existsSync(PROBLEMS_DIR)) return []

  const files = fs.readdirSync(PROBLEMS_DIR).filter(f => f.endsWith('.md'))
  const problems: Array<{ slug: string; name: string; difficulty: string; patternSlug: string }> = []

  for (const file of files) {
    const content = fs.readFileSync(path.join(PROBLEMS_DIR, file), 'utf-8')
    const meta = parseProblemFrontmatter(content)
    if (meta && meta.patternSlug === patternSlug) {
      problems.push({
        slug: file.replace('.md', ''),
        name: meta.name,
        difficulty: meta.difficulty,
        patternSlug: meta.patternSlug,
      })
    }
  }

  return problems
}

export function getProblemContent(problemSlug: string): { meta: Record<string, string>; content: string } | null {
  const filePath = path.join(PROBLEMS_DIR, `${problemSlug}.md`)
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const meta = parseProblemFrontmatter(raw) || {}
    return { meta, content: raw }
  } catch {
    return null
  }
}

function parseProblemFrontmatter(content: string): Record<string, string> | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null

  const frontmatter: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':')
    if (key && rest.length) {
      frontmatter[key.trim()] = rest.join(':').trim()
    }
  }
  return frontmatter
}

export function getAllProblemSlugs(): string[] {
  if (!fs.existsSync(PROBLEMS_DIR)) return []
  return fs.readdirSync(PROBLEMS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''))
}

// ─── Trace helpers ────────────────────────────────────────────────────────────

export function getAllTraceSlugs(): string[] {
  if (!fs.existsSync(TRACES_DIR)) return []
  return fs.readdirSync(TRACES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
}

export function getTraceData(slug: string): TraceData | null {
  const filePath = path.join(TRACES_DIR, `${slug}.json`)
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as TraceData
  } catch {
    return null
  }
}

export function getAllTraces(): TraceData[] {
  return getAllTraceSlugs()
    .map(slug => getTraceData(slug))
    .filter(Boolean) as TraceData[]
}
