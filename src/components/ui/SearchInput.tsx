'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Search, X, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  LifeBuoy,
  Map,
  DollarSign,
  Bus,
  FileText,
  UtensilsCrossed,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import { useSearch } from '@/contexts/SearchContext'
import { searchItems } from '@/lib/search/searchService'
import type { SearchInputProps } from '@/shared/types/componentsType/searchInput.type'
import { SearchIconType } from '@/shared/types'

const DEBOUNCE_DELAY = 300
const MAX_RESULTS = 10

const iconMap: Record<SearchIconType, LucideIcon> = {
  utensilsCrossed: UtensilsCrossed,
  map: Map,
  waves: Waves,
  bus: Bus,
  dollarSign: DollarSign,
  fileText: FileText,
  lifeBuoy: LifeBuoy,
}

const typeLabel: Record<'section' | 'subsection' | 'article', { label: string; dot: string }> = {
  section: { label: 'Раздел', dot: 'bg-[var(--color-main)]' },
  subsection: { label: 'Подраздел', dot: 'bg-[var(--color-accent)]' },
  article: { label: 'Статья', dot: 'bg-[var(--color-paragraph)]' },
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export default function SearchInput({ search, onClose }: SearchInputProps) {
  const { searchItems: allItems, isLoading, error } = useSearch()

  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const placeholder = search?.placeholder || 'Поиск...'
  const tags = search?.tags || []

  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY)

  const results = useMemo(() => {
    if (!debouncedQuery.trim() || !allItems.length) return []

    return searchItems(allItems, {
      query: debouncedQuery,
      limit: MAX_RESULTS,
      minScore: 5,
    })
  }, [debouncedQuery, allItems])

  const showDropdown = isOpen && query.trim().length > 0

  const closeDropdown = useCallback(() => {
    setIsOpen(false)
    setSelectedIndex(-1)
  }, [])

  const resetSearch = useCallback(() => {
    setQuery('')
    closeDropdown()
  }, [closeDropdown])

  const handleSelectResult = useCallback(
    (href: string) => {
      resetSearch()
      onClose?.()
    },
    [resetSearch, onClose],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showDropdown || results.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
          break

        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break

        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            const selected = results[selectedIndex]
            window.location.href = selected.href
            handleSelectResult(selected.href)
          }
          break

        case 'Escape':
          e.preventDefault()
          resetSearch()
          break
      }
    },
    [showDropdown, results, selectedIndex, handleSelectResult, resetSearch],
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        closeDropdown()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, closeDropdown])

  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [selectedIndex])

  useEffect(() => {
    if (query.trim().length > 0) {
      setIsOpen(true)
    }
  }, [query])

  return (
    <>
      <style>{`input[type="search"]::-webkit-search-cancel-button { display: none; }`}</style>
      <div ref={wrapperRef} className="relative flex items-center w-full">
        {isLoading && !query ? (
          <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin" size={20} aria-label="Загрузка" />
        ) : (
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
            aria-hidden="true"
          />
        )}

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading && !query}
          className="
            w-full h-14 pl-12 pr-10 rounded-2xl shadow-sm
            focus:outline-none focus:ring-2 focus:ring-[var(--color-main)]/30 focus:border-[var(--color-main)]/50
            placeholder:text-[#1D293D] text-[#1D293D] bg-white
            disabled:opacity-50 disabled:cursor-not-allowed
            border border-zinc-200
            transition-all duration-200
          "
          aria-label="Поиск по сайту"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={showDropdown}
          autoComplete="off"
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && query.trim() && (
            <Loader2 className="animate-spin text-blue-500" size={18} aria-label="Загрузка" />
          )}
          {query.trim() && (
            <button
              onClick={resetSearch}
              className="text-muted-foreground cursor-pointer hover:text-zinc-700 transition-colors"
              aria-label="Очистить поиск"
              type="button"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div
          id="search-results"
          ref={resultsRef}
          role="listbox"
          aria-label="Результаты поиска"
          aria-live="polite"
          aria-atomic="false"
          className={cn(
            'absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg transition-all duration-200 origin-top',
            showDropdown ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible',
          )}
        >
          <div className="max-h-[400px] overflow-y-auto">
            {error && (
              <div className="px-4 py-3 flex items-center gap-2 text-red-600">
                <AlertCircle size={16} />
                <span className="text-sm">Ошибка загрузки данных</span>
              </div>
            )}

            {!error && showDropdown && (
              <div className="relative">
                <div className={cn('transition-all duration-200', results.length > 0 ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 pointer-events-none')}>
                  {results.map((item, index) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      role="option"
                      aria-selected={index === selectedIndex}
                      className={cn(
                        'block border-b border-zinc-100 px-4 py-3 last:border-b-0 transition-colors',
                        index === selectedIndex
                          ? 'bg-[var(--color-main)]/[0.06] border-[var(--color-main)]/10'
                          : 'hover:bg-zinc-50',
                      )}
                      onClick={() => handleSelectResult(item.href)}
                    >
                      <div className="text-xs text-zinc-500 flex items-center gap-1.5">
                        <span className={cn('w-1.5 h-1.5 rounded-full', typeLabel[item.type].dot)} />
                        {typeLabel[item.type].label}
                        {item.searchTagText && (
                          <span className="text-zinc-400 mx-1">·</span>
                        )}
                        {item.searchTagText && (
                          <span className="text-zinc-700">{item.searchTagText}</span>
                        )}
                      </div>
                      <div className="font-medium text-zinc-950" title={item.title}>{item.title}</div>
                      {item.description && (
                        <p className="text-zinc-600 text-sm mt-0.5 line-clamp-2" title={item.description ?? ''}>
                          {item.description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
                {!isLoading && (
                  <div className={cn('transition-all duration-200', results.length === 0 ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 pointer-events-none')}>
                    <div className="px-4 py-6 text-center text-sm text-zinc-500">
                      Ничего не найдено
                    </div>
                  </div>
                )}
              </div>
            )}

            {isLoading && query.trim() && results.length === 0 && (
              <div className="px-4 py-6 flex items-center justify-center gap-2 text-zinc-500">
                <Loader2 className="animate-spin" size={16} />
                <span className="text-sm">Поиск...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap justify-start gap-3 mt-4 lg:max-w-[500px] max-sm:gap-1.5">
          {tags.map((tag) => {
            const IconComponent = tag.icon ? iconMap[tag.icon] : null
            return (
              <button
                key={tag.id || tag.title}
                type="button"
                onClick={() => setQuery(tag.title)}
                className="
                  bg-white shadow-sm text-sm text-[#314158]
                  max-sm:text-xs max-sm:px-2 max-sm:py-2
                  px-4 py-2.5
                  hover:bg-[var(--color-main)]/[0.06] hover:text-[var(--color-main)]
                  font-medium rounded-full border border-zinc-200
                  transition-all duration-300
                  hover:-translate-y-0.5 hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-main)]/30
                "
                aria-label={`Искать ${tag.title}`}
              >
                {IconComponent && (
                  <IconComponent
                    size={16}
                    className="inline-block mr-1.5"
                    color="var(--color-accent)"
                    aria-hidden="true"
                  />
                )}
                {tag.title}
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}
