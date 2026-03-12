'use client'

import { useSyncExternalStore } from 'react'
import { FlashCard } from '@/components/study/FlashCard'
import { RatingButtons } from '@/components/study/RatingButtons'
import { StudyProgress } from '@/components/study/StudyProgress'
import { EmptyState } from '@/components/study/EmptyState'
import { useStudySession } from '@/lib/hooks/useStudySession'
import { getDueCards, type StoredCard } from '@/lib/store/card-store'

function subscribe(cb: () => void) {
  window.addEventListener('storage', cb)
  return () => window.removeEventListener('storage', cb)
}

function getCardsSnapshot(): string {
  return JSON.stringify(getDueCards())
}

function getServerSnapshot(): string {
  return '[]'
}

export function StudyClient() {
  const raw = useSyncExternalStore(subscribe, getCardsSnapshot, getServerSnapshot)
  const dueCards: StoredCard[] = JSON.parse(raw)

  return <StudySessionView initialCards={dueCards} />
}

function StudySessionView({ initialCards }: { initialCards: StoredCard[] }) {
  const {
    currentCard,
    isFlipped,
    isComplete,
    intervalPreviews,
    reviewCount,
    totalCards,
    remainingCards,
    flipCard,
    submitRating,
  } = useStudySession(initialCards)

  if (isComplete) {
    return <EmptyState reviewCount={reviewCount} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Study</h1>
        <p className="text-muted-foreground mt-1">Review your due flashcards</p>
      </div>

      <StudyProgress current={reviewCount} total={totalCards} />

      {currentCard && (
        <div className="space-y-6">
          <FlashCard card={currentCard} isFlipped={isFlipped} onFlip={flipCard} />

          {isFlipped && intervalPreviews && (
            <RatingButtons
              intervalPreviews={intervalPreviews}
              onRate={submitRating}
            />
          )}

          <p className="text-center text-sm text-muted-foreground">
            {remainingCards} card{remainingCards !== 1 ? 's' : ''} remaining
          </p>
        </div>
      )}
    </div>
  )
}
