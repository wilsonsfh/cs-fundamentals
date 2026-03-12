import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface ProblemsTableProps {
  problems: Array<{ slug: string; name: string; difficulty: string; patternSlug: string }>
  patternSlug: string
}

const difficultyColor: Record<string, string> = {
  Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export function ProblemsTable({ problems, patternSlug }: ProblemsTableProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Solved Problems</h3>
      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-medium">Problem</th>
              <th className="text-left p-3 font-medium">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {problems.map(problem => (
              <tr key={problem.slug} className="border-b last:border-0 hover:bg-accent/50">
                <td className="p-3">
                  <Link
                    href={`/patterns/${patternSlug}/problems/${problem.slug}`}
                    className="text-primary hover:underline"
                  >
                    {problem.name}
                  </Link>
                </td>
                <td className="p-3">
                  <Badge variant="secondary" className={difficultyColor[problem.difficulty] || ''}>
                    {problem.difficulty}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
