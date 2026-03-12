'use client'

import { useState, useCallback, useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Search, Trash2 } from 'lucide-react'
import { getStoredCards, addCard, deleteCard, type StoredCard } from '@/lib/store/card-store'
import { useDebounce } from '@/lib/hooks/useDebounce'
import type { CardCategory } from '@/types/content'

function subscribe(cb: () => void) {
  window.addEventListener('storage', cb)
  return () => window.removeEventListener('storage', cb)
}

let cardsVersion = 0
function getCardsSnapshot(): string {
  return cardsVersion + ':' + JSON.stringify(getStoredCards())
}

function getServerSnapshot(): string {
  return '0:[]'
}

export function CardsClient() {
  const raw = useSyncExternalStore(subscribe, getCardsSnapshot, getServerSnapshot)
  const cards: StoredCard[] = JSON.parse(raw.slice(raw.indexOf(':') + 1))
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const debouncedSearch = useDebounce(search, 300)

  const refreshCards = useCallback(() => {
    cardsVersion++
  }, [])

  const filteredCards = cards.filter(card => {
    if (!debouncedSearch) return true
    const q = debouncedSearch.toLowerCase()
    return card.front.toLowerCase().includes(q) || card.back.toLowerCase().includes(q)
  })

  const handleAdd = (front: string, back: string, category: CardCategory) => {
    addCard({
      id: crypto.randomUUID(),
      front,
      back,
      category,
      source: 'manual',
      tags: [],
    })
    refreshCards()
    setShowAdd(false)
  }

  const handleDelete = (id: string) => {
    deleteCard(id)
    refreshCards()
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cards</h1>
          <p className="text-muted-foreground mt-1">{cards.length} total cards</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Card</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Flashcard</DialogTitle>
            </DialogHeader>
            <AddCardForm onSubmit={handleAdd} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search cards..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredCards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {cards.length === 0
              ? 'No cards yet. Add cards manually or import from pattern pages.'
              : 'No cards match your search.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredCards.map(card => (
            <Card key={card.id}>
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-medium text-sm">{card.front}</p>
                  <p className="text-sm text-muted-foreground truncate">{card.back}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className="text-xs">
                    {card.category.replace('_', ' ')}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(card.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function AddCardForm({ onSubmit }: { onSubmit: (front: string, back: string, category: CardCategory) => void }) {
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [category, setCategory] = useState<CardCategory>('algorithms')

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Front (Question)</label>
        <Textarea
          value={front}
          onChange={e => setFront(e.target.value)}
          placeholder="What is the time complexity of binary search?"
          rows={3}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Back (Answer)</label>
        <Textarea
          value={back}
          onChange={e => setBack(e.target.value)}
          placeholder="O(log n)"
          rows={3}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value as CardCategory)}
          className="w-full mt-1 rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="algorithms">Algorithms</option>
          <option value="data_structures">Data Structures</option>
          <option value="code">Code</option>
          <option value="general">General</option>
        </select>
      </div>
      <Button onClick={() => onSubmit(front, back, category)} disabled={!front.trim() || !back.trim()} className="w-full">
        Add Card
      </Button>
    </div>
  )
}
