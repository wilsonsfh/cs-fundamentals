/**
 * Phase 3: Sync pattern markdown files from Obsidian vault into the repo.
 *
 * Usage:
 *   node --experimental-strip-types scripts/sync-from-obsidian.ts
 *   node --experimental-strip-types scripts/sync-from-obsidian.ts --git   # also commit + push
 *
 * What it does:
 *   1. Reads each known pattern from the Obsidian vault
 *   2. Normalises Obsidian syntax (strips SR metadata, `` → `, --- dividers, == highlights in body)
 *   3. Writes to src/content/patterns/ (preserving == in Flashcards section for cloze parsing)
 *   4. Reports new / updated / unchanged / missing files
 *   5. With --git: stages, commits, and pushes if content changed
 */

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

// ─── Config ───────────────────────────────────────────────────────────────────

const OBSIDIAN_DIR = '/Users/WilsonSoon/obsidian-vaults/leetcode-notes/patterns'
const REPO_ROOT = path.resolve(import.meta.dirname, '..')
const PATTERNS_DIR = path.join(REPO_ROOT, 'src/content/patterns')

// Canonical slug order (matches PATTERN_META in content.ts)
const SLUGS = [
  'sliding-window',
  'two-pointers',
  'binary-search',
  'dfs-bfs',
  'dynamic-programming',
  'backtracking',
  'heap-priority-queue',
  'intervals',
  'hash-map-set',
  'string-parsing',
  'prefix-suffix-arrays',
]

// Overrides where Obsidian filename differs from slug
const SLUG_TO_OBSIDIAN: Record<string, string> = {
  'string-parsing': 'string-parsing-and-manipulation',
  'prefix-suffix-arrays': 'prefix and suffix arrays',
}

// ─── Transformation ───────────────────────────────────────────────────────────

/**
 * Transform Obsidian markdown into clean repo markdown.
 *
 * Rules applied to ALL sections:
 *   - Strip <!--SR:...--> spaced-repetition metadata
 *   - Strip standalone --- dividers (lines that are exactly "---")
 *   - Convert ``backtick`` → `backtick`
 *
 * Applied to body sections only (not Flashcards):
 *   - Strip ==highlight== markers (keep inner text)
 */
function transformContent(raw: string): string {
  // Split into body and flashcards section
  const flashcardsMatch = raw.match(/^([\s\S]*?)(^## Flashcards\s*[\s\S]*)$/m)

  let body = flashcardsMatch ? flashcardsMatch[1] : raw
  let flashcards = flashcardsMatch ? flashcardsMatch[2] : ''

  // Transform body
  body = stripCommon(body)
  body = body.replace(/==([^=\n]+)==/g, '$1')  // strip == highlights in body

  // Transform flashcards section
  flashcards = stripCommon(flashcards)
  // Keep == in flashcards (used for cloze deletion by parseFlashcards)

  return (body + flashcards).trimEnd() + '\n'
}

function stripCommon(text: string): string {
  return text
    .replace(/<!--SR:.*?-->/g, '')           // strip SR metadata
    .replace(/^---$/gm, '')                  // strip standalone dividers
    .replace(/``([^`\n]*?)``/g, '`$1`')      // `` → ` for inline code
    .replace(/\n{3,}/g, '\n\n')              // collapse 3+ blank lines → 2
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const doGit = process.argv.includes('--git')

type Status = 'new' | 'updated' | 'unchanged' | 'missing'
const results: Array<{ slug: string; status: Status }> = []
let hasChanges = false

for (const slug of SLUGS) {
  const obsidianName = SLUG_TO_OBSIDIAN[slug] ?? slug
  const obsidianPath = path.join(OBSIDIAN_DIR, `${obsidianName}.md`)
  const repoPath = path.join(PATTERNS_DIR, `${slug}.md`)

  if (!fs.existsSync(obsidianPath)) {
    results.push({ slug, status: 'missing' })
    continue
  }

  const raw = fs.readFileSync(obsidianPath, 'utf-8')
  const transformed = transformContent(raw)

  const existing = fs.existsSync(repoPath) ? fs.readFileSync(repoPath, 'utf-8') : null

  if (existing === transformed) {
    results.push({ slug, status: 'unchanged' })
    continue
  }

  fs.writeFileSync(repoPath, transformed, 'utf-8')
  results.push({ slug, status: existing === null ? 'new' : 'updated' })
  hasChanges = true
}

// ─── Report ───────────────────────────────────────────────────────────────────

const icons: Record<Status, string> = {
  new: '✨',
  updated: '📝',
  unchanged: '  ',
  missing: '❌',
}

console.log('\nObsidian → Repo sync\n')
for (const { slug, status } of results) {
  console.log(`  ${icons[status]} ${status.padEnd(9)} ${slug}`)
}

const updated = results.filter(r => r.status === 'updated').length
const newFiles = results.filter(r => r.status === 'new').length
const missing = results.filter(r => r.status === 'missing').length

console.log(`\n  ${newFiles} new · ${updated} updated · ${missing} missing`)

// ─── Git ──────────────────────────────────────────────────────────────────────

if (doGit) {
  if (!hasChanges) {
    console.log('\n  No changes — skipping git commit.\n')
    process.exit(0)
  }

  try {
    execSync('git add src/content/patterns/', { cwd: REPO_ROOT, stdio: 'inherit' })

    // Double-check staged diff
    const diff = execSync('git diff --cached --stat', { cwd: REPO_ROOT }).toString().trim()
    if (!diff) {
      console.log('\n  Nothing staged — skipping git commit.\n')
      process.exit(0)
    }

    const date = new Date().toISOString().slice(0, 10)
    execSync(`git commit -m "sync: update patterns from Obsidian ${date}"`, {
      cwd: REPO_ROOT,
      stdio: 'inherit',
    })
    execSync('git push', { cwd: REPO_ROOT, stdio: 'inherit' })
    console.log('\n  Committed and pushed.\n')
  } catch (err) {
    console.error('\n  Git operation failed:', err)
    process.exit(1)
  }
} else {
  console.log()
}
