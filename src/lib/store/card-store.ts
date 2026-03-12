import { createNewFsrsState, type CardFsrsState } from '@/lib/fsrs/scheduler'
import type { CardCategory, FlashcardEntry } from '@/types/content'

export interface StoredCard {
  id: string
  front: string
  back: string
  category: CardCategory
  source: string
  tags: string[]
  created_at: string
  updated_at: string
  fsrs: CardFsrsState
}

export interface ReviewLogEntry {
  card_id: string
  rating: number
  state: number
  reviewed_at: string
}

const CARDS_KEY = 'cs-fundamentals-cards'
const REVIEWS_KEY = 'cs-fundamentals-reviews'

export function getStoredCards(): StoredCard[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(CARDS_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveStoredCards(cards: StoredCard[]): void {
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards))
}

export function getReviewLogs(): ReviewLogEntry[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(REVIEWS_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveReviewLog(log: ReviewLogEntry): void {
  const logs = getReviewLogs()
  logs.push(log)
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(logs))
}

export function getDueCards(now = new Date()): StoredCard[] {
  return getStoredCards().filter(card => new Date(card.fsrs.due) <= now)
}

export function updateCardFsrs(cardId: string, fsrs: CardFsrsState): void {
  const cards = getStoredCards()
  const idx = cards.findIndex(c => c.id === cardId)
  if (idx !== -1) {
    cards[idx].fsrs = fsrs
    cards[idx].updated_at = new Date().toISOString()
    saveStoredCards(cards)
  }
}

export function addCard(card: Omit<StoredCard, 'fsrs' | 'created_at' | 'updated_at'>): StoredCard {
  const cards = getStoredCards()
  const now = new Date().toISOString()
  const newCard: StoredCard = {
    ...card,
    fsrs: createNewFsrsState(),
    created_at: now,
    updated_at: now,
  }
  cards.push(newCard)
  saveStoredCards(cards)
  return newCard
}

export function deleteCard(cardId: string): void {
  const cards = getStoredCards().filter(c => c.id !== cardId)
  saveStoredCards(cards)
}

export function importFlashcardsFromPattern(entries: FlashcardEntry[]): number {
  const cards = getStoredCards()
  const existingIds = new Set(cards.map(c => c.id))
  let added = 0

  for (const entry of entries) {
    if (existingIds.has(entry.id)) continue
    const now = new Date().toISOString()
    cards.push({
      id: entry.id,
      front: entry.front,
      back: entry.back,
      category: entry.category,
      source: entry.source,
      tags: [],
      created_at: now,
      updated_at: now,
      fsrs: createNewFsrsState(),
    })
    added++
  }

  saveStoredCards(cards)
  return added
}
