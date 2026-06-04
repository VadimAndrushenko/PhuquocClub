'use client'

import { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
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
import type { SearchItem, SearchInputProps } from '@/shared/types/componentsType/serchInput.type'
import { SearchIconType } from '@/shared/types'

const iconMap: Record<SearchIconType, LucideIcon> = {
  utensilsCrossed: UtensilsCrossed,
  map: Map,
  waves: Waves,
  bus: Bus,
  dollarSign: DollarSign,
  fileText: FileText,
  lifeBuoy: LifeBuoy,
}

const typeLabel: Record<'section' | 'subSection' | 'article', string> = {
  section: 'Раздел',
  subSection: 'Подраздел',
  article: 'Статья',
}

export default function SearchInput({ search, onClose }: SearchInputProps) {
  // 🔥 Используем глобальное состояние — данные загружаются 1 раз на всё приложение
  const { searchItems, isLoading, refreshSearch } = useSearch()

  const [query, setQuery] = useState('')
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const placeholder = search?.placeholder || 'Поиск...'
  const tags = search?.tags || []

  // Текстовый поиск — просто фильтрация (оптимизировано)
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || !searchItems.length) return []
    return searchItems.filter((item) => item.searchText.includes(q))
  }, [query, searchItems])

  const showDropdown = query.trim().length > 0 && !isLoading

  // Клик вне — закрыть dropdown
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setQuery('')
    }
  }, [])

  useEffect(() => {
    if (!showDropdown) return

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown, handleClickOutside])

  return (
    <>
      <div ref={wrapperRef} className="relative flex items-center w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="w-full h-14 pl-12 pr-10 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#1D293D] text-[#1D293D] bg-white disabled:opacity-50"
        />

        {showDropdown && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-zinc-700"
          >
            <X size={20} />
          </button>
        )}

        <div
          className={cn(
            'absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg transition-all duration-300 origin-top',
            showDropdown
              ? 'opacity-100 translate-y-0 visible'
              : 'opacity-0 -translate-y-15 invisible',
          )}
        >
          <div className="max-h-80 overflow-y-auto">
            {results.length > 0 ? (
              results.map((item) => (
                <Link
                  key={`${item.type}-${item.href}`}
                  href={item.href}
                  className="block border-b border-zinc-100 px-4 py-3 last:border-b-0 hover:bg-zinc-50 text-left"
                  onClick={() => {
                    setQuery('')
                    onClose?.()
                  }}
                >
                  <div className="text-xs text-zinc-500 flex items-center gap-2">
                    {typeLabel[item.type]}
                    {item.searchIcon && (
                      <>
                        {item.searchTagText && (
                          <span className="text-zinc-700">{item.searchTagText}</span>
                        )}
                      </>
                    )}
                  </div>
                  <div className="font-medium text-zinc-950">{item.title}</div>
                  {item.description && (
                    <p className="text-zinc-600 text-sm mt-0.5 line-clamp-2">{item.description}</p>
                  )}
                </Link>
              ))
            ) : showDropdown ? (
              <div className="px-4 py-3 text-sm text-zinc-500">Ничего не найдено</div>
            ) : null}
          </div>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap justify-start gap-3 mt-4 lg:max-w-[500px] max-sm:gap-1.5">
          {tags.map((tag) => {
            const IconComponent = iconMap[tag.icon]
            return (
              <button
                key={tag.id}
                className="px-4 py-2.5 rounded-full bg-white shadow-sm text-sm hover:bg-zinc-100 text-[#314158] max-sm:text-xs max-sm:px-2 max-sm:py-2 transition-colors"
                onClick={() => setQuery(tag.title)}
              >
                {IconComponent && (
                  <IconComponent
                    size={16}
                    className="inline-block mr-1.5"
                    color="var(--color-accent)"
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
