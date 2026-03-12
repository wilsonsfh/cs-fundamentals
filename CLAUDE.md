# CLAUDE.md

## Commands

```bash
npm run dev       # Start dev server at localhost:3000
npm run build     # Production build (type-check + lint)
npm run lint      # ESLint
```

No test suite exists. Type-check only: `npx tsc --noEmit`.

## Architecture

### App Router Layout

- `(main)/` — all routes. Layout provides sidebar + mobile nav shell.
- `(main)/page.tsx` — dashboard (client component, reads from localStorage)
- `(main)/patterns/` — pattern index + detail pages (SSG)
- `(main)/patterns/[slug]/problems/[problemSlug]/` — problem detail (SSG)
- `(main)/study/` — flashcard study session (client, FSRS)
- `(main)/cards/` — card management CRUD (client, localStorage)
- `(main)/trace/` — algorithm tracer (Phase 2 placeholder)

### Content

- Pattern notes: `src/content/patterns/*.md` (migrated from Obsidian vault, now repo is source of truth)
- Problem writeups: `src/content/problems/*.md` (frontmatter: name, difficulty, patternSlug, link)
- Content loading: `src/lib/content.ts` (server-side fs reads, parsed at build time via SSG)
- Obsidian vault location: `/Users/WilsonSoon/obsidian-vaults/leetcode-notes/patterns/`

### Data Storage (Phase 1 = localStorage)

- Cards + FSRS state: `cs-fundamentals-cards` key in localStorage
- Review logs: `cs-fundamentals-reviews` key
- Card store: `src/lib/store/card-store.ts`
- FSRS scheduler: `src/lib/fsrs/scheduler.ts` (wraps ts-fsrs)

### UI Conventions

- shadcn/ui components in `src/components/ui/` — "new-york" style, neutral base, Tailwind CSS 4
- Add new shadcn components: `npx shadcn@3.8.5 add <component>`
- Fonts: Inter (UI) + JetBrains Mono (code)
- Theme: next-themes with class-based dark mode
- Icons: Lucide React

### Flashcard System

- Ported from cs-flashcards project, adapted for localStorage
- FSRS config: 0.9 retention, 365 max interval, fuzz + short-term enabled
- Flashcards auto-parsed from pattern markdown (:: and ? Obsidian syntax)
- `parseFlashcards()` in `src/lib/content.ts` handles both `::` and `?` separators, SR metadata

### Pattern Page Structure

Each pattern markdown has sections: When to Use, Template, My Gotchas, Key Problems, Flashcards.
The detail page renders these as tabs.

---

## Roadmap

### Phase 1 — Foundation (COMPLETE)
- Pattern pages (11 patterns from Obsidian)
- Flashcard system with FSRS (localStorage)
- Dashboard with stats + review history
- Problem detail pages

### Phase 2 — Algorithm Tracer (NEXT)
- Custom SVG visualizers (array, tree, graph, hash-map, stack)
- Hand-crafted trace JSON for 5 algorithms (Two Sum, Binary Search, BFS, Merge Sort, Sliding Window)
- TracePlayer with play/pause/step/speed controls
- Variable watch panel + code panel with active line highlighting
- Zustand store for trace playback state

### Phase 3 — Obsidian Sync + Git Auto-update

**Goal:** Keep `src/content/patterns/*.md` in sync with the Obsidian vault, and automatically commit + push changes so the app stays up to date.

**Two-part feature:**

#### 3.1 — Obsidian → Repo Sync Script

A Node.js/shell script at `scripts/sync-from-obsidian.ts` that:
- Reads all `.md` files from `/Users/WilsonSoon/obsidian-vaults/leetcode-notes/patterns/`
- Normalises filenames to slugs (e.g. `"prefix and suffix arrays.md"` → `prefix-suffix-arrays.md`)
- Strips Obsidian-specific syntax that doesn't render well (SR metadata `<!--SR:...-->`, `==highlights==`)
- Writes updated files to `src/content/patterns/`
- Logs a diff of what changed (new files, updated files, removed files)

Run manually: `npx ts-node scripts/sync-from-obsidian.ts`

#### 3.2 — Flashcard Sync

After sync, re-parse flashcards from the updated pattern files using `parseFlashcards()` in `src/lib/content.ts`.
Cards that don't yet exist in localStorage are imported; existing cards (matched by ID) are not overwritten (preserving FSRS state).
New flashcards added to Obsidian will automatically appear after next sync + refresh.

#### 3.3 — Auto Git Commit + Push

After a successful sync, the script:
1. Runs `git add src/content/patterns/`
2. Checks `git diff --cached --quiet` — exits early if no changes
3. Commits: `git commit -m "sync: update patterns from Obsidian <ISO date>"`
4. Pushes: `git push`

This can be run on a cron schedule (e.g. daily) or triggered manually.

**Future:** Obsidian community plugin that triggers the sync script via a webhook or shell call on file save.

### Phase 4 — Advanced

- Supabase auth + multi-device sync (replace localStorage with Postgres)
- AI trace generator via Groq (generate TraceStep JSON from code + input)
- LeetCode URL import for problems
- Adaptive drills (FSRS-weighted problem selection)
- Comparative traces (brute force vs optimal side-by-side)
- System design section (`/system-design`)
