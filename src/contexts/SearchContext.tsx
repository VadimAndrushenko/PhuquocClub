"use client"

import { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from "react"
import { getSearchData } from "@/lib/getSearchData"
import type { SearchItem } from "@/shared/types/componentsType/serchInput.type"

interface SearchContextType {
  searchItems: SearchItem[]
  isLoading: boolean
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

// 🔥 Глобальное хранилище — общее для всех экземпляров
let globalSearchItems: SearchItem[] = []
let globalIsLoading = true
let globalInitialized = false
let globalListeners: Set<() => void> = new Set()

function notifyListeners() {
  globalListeners.forEach(listener => listener())
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchItems, setSearchItems] = useState<SearchItem[]>(globalSearchItems)
  const [isLoading, setIsLoading] = useState(globalIsLoading)
  const initializedRef = useRef(globalInitialized)

  const updateState = useCallback(() => {
    setSearchItems(globalSearchItems)
    setIsLoading(globalIsLoading)
  }, [])

  useEffect(() => {
    // Подписываемся на обновления
    globalListeners.add(updateState)
    
    // 🔥 Загружаем только если ещё не загружено
    if (!initializedRef.current) {
      globalInitialized = true
      initializedRef.current = true
      
      getSearchData()
        .then((items) => {
          globalSearchItems = items
          globalIsLoading = false
          notifyListeners()
        })
        .catch((error) => {
          console.error('❌ Ошибка загрузки поиска:', error)
          globalIsLoading = false
          notifyListeners()
        })
    }

    return () => {
      globalListeners.delete(updateState)
    }
  }, [updateState])

  return (
    <SearchContext.Provider value={{ searchItems, isLoading }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch должен использоваться внутри SearchProvider')
  }
  return context
}
