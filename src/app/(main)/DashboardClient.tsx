'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { ReviewHistoryChart } from '@/components/dashboard/ReviewHistoryChart'
import { getStoredCards, getDueCards, getReviewLogs } from '@/lib/store/card-store'
import { computeStreak, computeMastery } from '@/lib/utils/date'
import { ArrowRight } from 'lucide-react'

function subscribe(cb: () => void) {
  window.addEventListener('storage', cb)
  return () => window.removeEventListener('storage', cb)
}

function getSnapshot() {
  const cards = getStoredCards()
  const dueCards = getDueCards()
  const logs = getReviewLogs()

  const streak = computeStreak(logs)
  const mastery = computeMastery(cards.map(c => ({ state: c.fsrs.state })))

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86_400_000)
  const dailyCounts = new Map<string, number>()

  for (const log of logs) {
    const d = new Date(log.reviewed_at)
    if (d >= thirtyDaysAgo) {
      const key = d.toISOString().split('T')[0]
      dailyCounts.set(key, (dailyCounts.get(key) || 0) + 1)
    }
  }

  const chartData: Array<{ date: string; count: number }> = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86_400_000)
    const key = d.toISOString().split('T')[0]
    if (dailyCounts.has(key)) {
      chartData.push({ date: key, count: dailyCounts.get(key)! })
    }
  }

  return JSON.stringify({
    stats: { dueCount: dueCards.length, totalCards: cards.length, masteryPct: mastery, streak },
    chartData,
  })
}

function getServerSnapshot() {
  return JSON.stringify({
    stats: { dueCount: 0, totalCards: 0, masteryPct: 0, streak: 0 },
    chartData: [],
  })
}

export function DashboardClient() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const { stats, chartData } = JSON.parse(raw)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Your learning progress at a glance</p>
      </div>

      <StatsGrid {...stats} />

      {stats.dueCount > 0 && (
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <p className="font-medium">You have {stats.dueCount} cards due for review</p>
            <Button asChild>
              <Link href="/study">
                Start Studying <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <ReviewHistoryChart data={chartData} />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/patterns">Browse Patterns</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/trace">Algorithm Tracer</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/cards">Manage Cards</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
