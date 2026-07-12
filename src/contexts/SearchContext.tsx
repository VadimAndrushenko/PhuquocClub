'use client'

import { createContext, useContext, ReactNode } from 'react'
import useSWR from 'swr'
import { usePathname } from 'next/navigation'
import type { SearchItem } from '@/lib/search/types'

interface SearchContextType {
  searchItems: SearchItem[]
  isLoading: boolean
  error: Error | null
  mutate: () => void
  isValidating: boolean
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

const searchFetcher = async (url: string): Promise<SearchItem[]> => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Search API failed: ${response.status}`)
  }

  const data = await response.json()
  return data.items || []
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const locale = pathname.startsWith('/en') ? 'en' : 'ru'

  const { data, error, mutate, isValidating, isLoading } = useSWR<SearchItem[], Error>(
    `/api/search?locale=${locale}`,
    searchFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000,
      dedupingInterval: 2000,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      fallbackData: [],
      keepPreviousData: true,
    },
  )

  const value: SearchContextType = {
    searchItems: data || [],
    isLoading,
    error: error || null,
    mutate,
    isValidating,
  }

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export function useSearch(): SearchContextType {
  const context = useContext(SearchContext)

  if (context === undefined) {
    throw new Error('useSearch должен использоваться внутри SearchProvider')
  }

  return context
}

export function useRefreshSearch() {
  const { mutate } = useSearch()
  return mutate
}
