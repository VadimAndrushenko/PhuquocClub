import type { SearchItem } from '@/lib/search/types'
import { slugify } from '@/lib/utils'

interface SearchOptions {
  query: string
  limit?: number
  minScore?: number
}

interface SearchResult extends SearchItem {
  score: number
  highlights: string[]
}

function normalizeQuery(query: string): string {
  return slugify(query).replace(/-/g, ' ').trim()
}

function calculateRelevance(item: SearchItem, queryTerms: string[]): number {
  let score = 0
  const titleLower = item.title.toLowerCase()
  const descLower = (item.description || '').toLowerCase()
  const searchText = item.searchText.toLowerCase()

  queryTerms.forEach((term) => {
    if (titleLower === term) {
      score += 100
    } else if (titleLower.startsWith(term)) {
      score += 50
    } else if (titleLower.includes(term)) {
      score += 30
    }

    if (descLower.includes(term)) {
      score += 10
    }

    if (searchText.includes(term)) {
      score += 5
    }
  })

  if (item.type === 'section') score += 2
  else if (item.type === 'subsection') score += 1

  return score
}

function findHighlights(text: string, queryTerms: string[]): string[] {
  const highlights: string[] = []
  const textLower = text.toLowerCase()

  queryTerms.forEach((term) => {
    const index = textLower.indexOf(term)
    if (index !== -1) {
      const start = Math.max(0, index - 20)
      const end = Math.min(text.length, index + term.length + 20)
      highlights.push(text.substring(start, end))
    }
  })

  return highlights
}

export function searchItems(items: SearchItem[], options: SearchOptions): SearchResult[] {
  const { query, limit = 20, minScore = 5 } = options

  if (!query || !query.trim()) return []

  const normalizedQuery = normalizeQuery(query)
  const queryTerms = normalizedQuery.split(' ').filter(Boolean)

  if (queryTerms.length === 0) return []

  const results: SearchResult[] = items
    .map((item) => {
      const score = calculateRelevance(item, queryTerms)
      if (score < minScore) return null

      const highlights = findHighlights(`${item.title} ${item.description || ''}`, queryTerms)

      return { ...item, score, highlights }
    })
    .filter((result): result is SearchResult => result !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return results
}

export function simpleSearch(items: SearchItem[], query: string): SearchItem[] {
  if (!query || !query.trim()) return []

  const normalizedQuery = normalizeQuery(query)

  return items.filter((item) => item.searchText.includes(normalizedQuery))
}
