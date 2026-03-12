'use client'

import { CodeBlock } from '@/components/ui/CodeBlock'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const elements = parseMarkdown(content)

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {elements.map((el, i) => (
        <MarkdownElement key={i} element={el} />
      ))}
    </div>
  )
}

type ParsedElement =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'list'; items: string[]; ordered: boolean }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'blockquote'; text: string }
  | { type: 'hr' }

function parseMarkdown(content: string): ParsedElement[] {
  const elements: ParsedElement[] = []
  const lines = content.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Horizontal rule
    if (/^---+\s*$/.test(line)) {
      elements.push({ type: 'hr' })
      i++
      continue
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/)
    if (headingMatch) {
      elements.push({ type: 'heading', level: headingMatch[1].length, text: headingMatch[2] })
      i++
      continue
    }

    // Code block
    if (line.startsWith('```')) {
      const language = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push({ type: 'code', language, code: codeLines.join('\n') })
      i++ // skip closing ```
      continue
    }

    // Table
    if (line.includes('|') && i + 1 < lines.length && /^\|?\s*[-:]+/.test(lines[i + 1])) {
      const headers = line.split('|').map(s => s.trim()).filter(Boolean)
      i += 2 // skip header + separator
      const rows: string[][] = []
      while (i < lines.length && lines[i].includes('|')) {
        rows.push(lines[i].split('|').map(s => s.trim()).filter(Boolean))
        i++
      }
      elements.push({ type: 'table', headers, rows })
      continue
    }

    // Blockquote
    if (line.startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].slice(1).trim())
        i++
      }
      elements.push({ type: 'blockquote', text: quoteLines.join('\n') })
      continue
    }

    // Unordered list
    if (/^\s*[-*]\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''))
        i++
      }
      elements.push({ type: 'list', items, ordered: false })
      continue
    }

    // Ordered list
    if (/^\s*\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''))
        i++
      }
      elements.push({ type: 'list', items, ordered: true })
      continue
    }

    // Empty line
    if (!line.trim()) {
      i++
      continue
    }

    // Paragraph (collect consecutive non-empty lines)
    const paraLines: string[] = []
    while (i < lines.length && lines[i].trim() && !lines[i].startsWith('#') && !lines[i].startsWith('```') && !lines[i].startsWith('>') && !/^\s*[-*]\s/.test(lines[i]) && !/^\s*\d+\.\s/.test(lines[i])) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length) {
      elements.push({ type: 'paragraph', text: paraLines.join(' ') })
    }
  }

  return elements
}

function MarkdownElement({ element }: { element: ParsedElement }) {
  switch (element.type) {
    case 'hr':
      return <hr className="my-6 border-border" />

    case 'heading': {
      const Tag = `h${element.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      const sizes: Record<number, string> = {
        1: 'text-2xl font-bold mt-8 mb-4',
        2: 'text-xl font-semibold mt-6 mb-3',
        3: 'text-lg font-semibold mt-4 mb-2',
        4: 'text-base font-semibold mt-3 mb-1',
      }
      return <Tag className={sizes[element.level] || sizes[4]}><InlineMarkdown text={element.text} /></Tag>
    }

    case 'code':
      return <div className="my-4"><CodeBlock code={element.code} language={element.language} /></div>

    case 'paragraph':
      return <p className="my-2 leading-relaxed"><InlineMarkdown text={element.text} /></p>

    case 'blockquote':
      return <blockquote className="border-l-4 border-primary/30 pl-4 my-4 text-muted-foreground italic">{element.text}</blockquote>

    case 'list': {
      const Tag = element.ordered ? 'ol' : 'ul'
      return (
        <Tag className={`my-2 pl-6 space-y-1 ${element.ordered ? 'list-decimal' : 'list-disc'}`}>
          {element.items.map((item, i) => (
            <li key={i} className="leading-relaxed"><InlineMarkdown text={item} /></li>
          ))}
        </Tag>
      )
    }

    case 'table':
      return (
        <div className="my-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                {element.headers.map((h, i) => (
                  <th key={i} className="text-left p-2 font-semibold"><InlineMarkdown text={h} /></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {element.rows.map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  {row.map((cell, j) => (
                    <td key={j} className="p-2"><InlineMarkdown text={cell} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}

function InlineMarkdown({ text }: { text: string }) {
  // Process inline markdown: bold, italic, code, links
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Link: [text](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    // Inline code: `text`
    const codeMatch = remaining.match(/`([^`]+)`/)

    // Find earliest match
    const matches = [
      linkMatch && { type: 'link', match: linkMatch },
      boldMatch && { type: 'bold', match: boldMatch },
      codeMatch && { type: 'code', match: codeMatch },
    ].filter(Boolean).sort((a, b) => (a!.match!.index ?? 0) - (b!.match!.index ?? 0))

    if (matches.length === 0) {
      parts.push(remaining)
      break
    }

    const first = matches[0]!
    const idx = first.match!.index!

    // Add text before match
    if (idx > 0) {
      parts.push(remaining.slice(0, idx))
    }

    switch (first.type) {
      case 'link':
        parts.push(
          <a key={key++} href={first.match![2]} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:text-primary/80">
            {first.match![1]}
          </a>
        )
        remaining = remaining.slice(idx + first.match![0].length)
        break
      case 'bold':
        parts.push(<strong key={key++}>{first.match![1]}</strong>)
        remaining = remaining.slice(idx + first.match![0].length)
        break
      case 'code':
        parts.push(
          <code key={key++} className="px-1.5 py-0.5 rounded bg-muted font-mono text-sm">
            {first.match![1]}
          </code>
        )
        remaining = remaining.slice(idx + first.match![0].length)
        break
    }
  }

  return <>{parts}</>
}
