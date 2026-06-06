'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from 'react'
import { getSearchData } from '@/lib/getSearchData'
import type { SearchItem } from '@/shared/types/componentsType/serchInput.type'

interface SearchContextType {
  searchItems: SearchItem[]
  isLoading: boolean
  refreshSearchData: () => Promise<void>
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

// 🔥 Глобальное хранилище — общее для всех экземпляров
let globalSearchItems: SearchItem[] = []
let globalIsLoading = true
let globalInitialized = false
let globalListeners: Set<() => void> = new Set()

// 🔥 ISR: Автообновление каждые 30 секунд
let autoUpdateInterval: NodeJS.Timeout | null = null

function notifyListeners() {
  globalListeners.forEach((listener) => listener())
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchItems, setSearchItems] = useState<SearchItem[]>(globalSearchItems)
  const [isLoading, setIsLoading] = useState(globalIsLoading)
  const initializedRef = useRef(globalInitialized)

  const updateState = useCallback(() => {
    setSearchItems(globalSearchItems)
    setIsLoading(globalIsLoading)
  }, [])

  const refreshSearchData = useCallback(async () => {
    try {
      const items = await getSearchData(true) // forceRefresh = true
      globalSearchItems = items
      globalIsLoading = false
      notifyListeners()
    } catch (error) {
      console.error('❌ Ошибка обновления поиска:', error)
      globalIsLoading = false
      notifyListeners()
    }
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

      // 🔥 ISR: Автообновление каждые 30 секунд
      autoUpdateInterval = setInterval(() => {
        getSearchData()
          .then((items) => {
            globalSearchItems = items
            globalIsLoading = false
            notifyListeners()
          })
          .catch((error) => {
            console.error('❌ Ошибка автообновления поиска:', error)
          })
      }, 30000) // 30 секунд
    }

    return () => {
      globalListeners.delete(updateState)
    }
  }, [updateState])

  // 🔥 Очистка интервала при размонтировании
  useEffect(() => {
    return () => {
      if (autoUpdateInterval) {
        clearInterval(autoUpdateInterval)
      }
    }
  }, [])

  return (
    <SearchContext.Provider value={{ searchItems, isLoading, refreshSearchData }}>
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
