'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ArticleCard } from '@/components/ui/InfoCard'
  import { ChevronDown, Filter, Check, X } from 'lucide-react'

interface Article {
  id: string | number
  href: string
  category?: string
  image?: string
  title: string
  description: string
  readTime?: string
}

interface ArticleGridProps {
  articles: Article[]
  className?: string
  title?: string
  itemsPerPage?: number
  categories?: string[]
}

export default function ArticleGrid({
  articles,
  className = '',
  title,
  itemsPerPage = 4,
  categories = [],
}: ArticleGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isAnimating, setIsAnimating] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  if (!articles || articles.length === 0) return null

  const filteredArticles = selectedCategory
    ? articles.filter((article) => article.category === selectedCategory)
    : articles

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentArticles = filteredArticles.slice(startIndex, endIndex)

  const hasPrevPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  const handlePageChange = (page: number) => {
    if (page === currentPage || isAnimating) return
    setIsAnimating(true)

    setTimeout(() => {
      setCurrentPage(page)
      setIsAnimating(false)
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
  }

  const handleCategoryChange = (category: string) => {
    if (isAnimating) return
    setIsAnimating(true)

    setTimeout(() => {
      setSelectedCategory(category)
      setCurrentPage(1)
      setIsAnimating(false)
    }, 300)
  }

// Добавь состояние для dropdown
const [isDropdownOpen, setIsDropdownOpen] = useState(false)
const dropdownRef = useRef<HTMLDivElement>(null)

// Закрытие при клике вне dropdown
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false)
    }
  }

  if (isDropdownOpen) {
    document.addEventListener('mousedown', handleClickOutside)
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside)
  }
}, [isDropdownOpen])

// Подсчет количества статей в каждой категории
const getCategoryCount = (category: string) => {
  if (!category) return articles.length
  return articles.filter((a) => a.category === category).length
}

// Иконки для категорий (опционально)
const categoryIcons: Record<string, string> = {
  'ТРАНСПОРТ': '🚗',
  'ЕДА': '🍽️',
  'ПЛЯЖИ': '🏖️',
  'БЕЗОПАСНОСТЬ': '🛡️',
  'ПРАКТИКА': '💡',
  'МАРШРУТЫ': '🗺️',
  'РАЗВЛЕЧЕНИЯ': '🎯',
  'ДОКУМЕНТЫ': '📄',
  'ШОПИНГ': '🛍️',
  'ДОСТОПРИМЕЧАТЕЛЬНОСТИ': '🏛️',
}

  return (
    <section className={className}>
      {title && (
        <div className="flex items-end justify-between gap-4">
          <h2 className="title flex-1">{title}</h2>
          <span className="text-sm text-paragraph">
            {filteredArticles.length}{' '}
            {declOfNum(filteredArticles.length, ['подборка', 'подборки', 'подборок'])}
          </span>
        </div>
      )}

      {/* Красивый кастомный dropdown */}
      {categories.length > 0 && (
        <div className="mb-8" ref={dropdownRef}>
          <div className="relative inline-block min-w-full">
            {/* Кнопка открытия */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isAnimating}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl",
                "bg-white border-2 transition-all duration-300",
                "shadow-sm hover:shadow-md",
                isDropdownOpen
                  ? "border-main shadow-main/20"
                  : "border-gray-100 hover:border-gray-200",
                isAnimating && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-xl transition-colors",
                  isDropdownOpen ? "bg-main text-white" : "bg-gray-50 text-paragraph"
                )}>
                  <Filter size={18} />
                </div>
                <div className="text-left">
                  <div className="text-xs text-paragraph mb-0.5">Категория</div>
                  <div className="font-semibold text-main">
                    {selectedCategory || 'Все категории'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedCategory && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCategoryChange('')
                    }}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Сбросить фильтр"
                  >
                    <X size={16} className="text-paragraph" />
                  </button>
                )}
                <ChevronDown
                  size={20}
                  className={cn(
                    "text-paragraph transition-transform duration-300",
                    isDropdownOpen && "rotate-180 text-main"
                  )}
                />
              </div>
            </button>

            {/* Выпадающий список */}
            <div
              className={cn(
                "absolute top-full left-0 right-0 mt-2 z-50",
                "bg-white rounded-2xl border border-gray-100",
                "shadow-xl shadow-black/5",
                "transition-all duration-300 origin-top",
                "overflow-hidden",
                isDropdownOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              )}
            >
              {/* Заголовок */}
              <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
                <div className="text-xs font-semibold text-paragraph uppercase tracking-wider">
                  Выберите категорию
                </div>
              </div>

              {/* Список опций */}
              <div className="max-h-[320px] overflow-y-auto p-2">
                {/* Все категории */}
                <button
                  onClick={() => {
                    handleCategoryChange('')
                    setIsDropdownOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl",
                    "transition-all duration-200",
                    "hover:bg-gray-50",
                    !selectedCategory && "bg-main/5 hover:bg-main/10"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-xl text-lg",
                      !selectedCategory ? "bg-main text-white" : "bg-gray-100"
                    )}>
                      📚
                    </div>
                    <div className="text-left flex-1">
                      <div className={cn(
                        "font-semibold",
                        !selectedCategory ? "text-main" : "text-paragraph"
                      )}>
                        Все категории
                      </div>
                      <div className="text-xs text-paragraph">
                        Показать все статьи
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs font-semibold px-2.5 py-1 rounded-full",
                      !selectedCategory
                        ? "bg-main text-white"
                        : "bg-gray-100 text-paragraph"
                    )}>
                      {getCategoryCount('')}
                    </span>
                    {!selectedCategory && (
                      <Check size={18} className="text-main" />
                    )}
                  </div>
                </button>

                {/* Разделитель */}
                <div className="h-px bg-gray-100 my-2 mx-4" />

                {/* Категории */}
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      handleCategoryChange(category)
                      setIsDropdownOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl max-[400px]:px-2 ",
                      "transition-all duration-200",
                      "hover:bg-gray-50",
                      selectedCategory === category && "bg-main/5 hover:bg-main/10"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={cn(
                        "flex items-center justify-center w-10 aspect-square rounded-xl text-lg max-[400px]:w-8",
                        selectedCategory === category
                          ? "bg-main text-white"
                          : "bg-gray-100"
                      )}>
                        {categoryIcons[category] || '📄'}
                      </div>
                      <div className="text-left flex-1">
                        <div className={cn(
                          "font-semibold max-[400px]:text-sm",
                          selectedCategory === category ? "text-main" : "text-paragraph"
                        )}>
                          {category}
                        </div>
                        <div className="text-xs text-paragraph">
                          {getCategoryCount(category)}{' '}
                          {declOfNum(getCategoryCount(category), ['статья', 'статьи', 'статей'])}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs font-semibold px-2.5 py-1 rounded-full",
                        selectedCategory === category
                          ? "bg-main text-white"
                          : "bg-gray-100 text-paragraph"
                      )}>
                        {getCategoryCount(category)}
                      </span>
                      {selectedCategory === category && (
                        <Check size={18} className="text-main" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Футер */}
              {selectedCategory && (
                <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/50">
                  <button
                    onClick={() => {
                      handleCategoryChange('')
                      setIsDropdownOpen(false)
                    }}
                    className="w-full text-center text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                  >
                    Сбросить фильтр
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div ref={gridRef} className="relative scroll-mt-[120px]">
        <div
          className={cn(
            'grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all duration-300',
            isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          )}
        >
          {currentArticles.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-paragraph text-lg">Статьи не найдены</p>
              {selectedCategory && (
                <button
                  onClick={() => handleCategoryChange('')}
                  className="mt-4 text-accent hover:underline"
                >
                  Сбросить фильтр
                </button>
              )}
            </div>
          ) : (
            currentArticles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                href={article.href}
                category={article.category}
                // image={article.image}
                title={article.title}
                description={article.description}
                readTime={article.readTime}
              />
            ))
          )}
        </div>
      </div>

      {/* 📱 Адаптивная пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 sm:gap-2 mt-10 px-2">
          {/* ← Стрелка назад */}
          {hasPrevPage && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={isAnimating}
              className={cn(
                'shrink-0 mr-2 flex items-center justify-center rounded-full bg-main border border-main text-white transition-all duration-200 hover:bg-white hover:text-main hover:-translate-y-1 shadow-sm',
                'w-8 h-8 sm:w-10 sm:h-10',
                isAnimating && 'opacity-50 cursor-not-allowed'
              )}
              aria-label="Предыдущая страница"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Номера страниц — на мобильном показываем только текущую и соседние */}
          <div className="flex items-center gap-1 sm:gap-2">
            {getPageNumbers(currentPage, totalPages).map((page, index) =>
              page === '...' ? (
                <span
                  key={`dots-${index}`}
                  className="w-3 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-paragraph text-sm sm:text-base"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  disabled={isAnimating}
                  className={cn(
                    'flex items-center justify-center rounded-full font-medium transition-all duration-200',
                    'w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base',
                    currentPage === page
                      ? 'bg-main text-white shadow-md scale-105'
                      : 'bg-white border border-gray-200 text-paragraph hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-1',
                    isAnimating && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {page}
                </button>
              )
            )}
          </div>

          {/* → Стрелка вперёд */}
          {hasNextPage && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={isAnimating}
              className={cn(
                'shrink-0 ml-2 flex items-center justify-center rounded-full bg-main border border-main text-white transition-all duration-200 hover:bg-white hover:text-main hover:-translate-y-1 shadow-sm',
                'w-8 h-8 sm:w-10 sm:h-10',
                isAnimating && 'opacity-50 cursor-not-allowed'
              )}
              aria-label="Следующая страница"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      )}
    </section>
  )
}

// 📐 Умное отображение номеров страниц
function getPageNumbers(
  current: number,
  total: number,
): (number | string)[] {
  // На десктопе показываем все страницы до 7, потом с многоточиями

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }

    if (current <= 3) {
      return [1, 2, 3, 4, '...', total]
    } else if (current >= total - 2) {
      return [1, '...', total - 3, total - 2, total - 1, total]
    } else {
      return [1, '...', current - 1, current, current + 1, '...', total]
    }
  }

function declOfNum(number: number, titles: [string, string, string]): string {
  const cases = [2, 0, 1, 1, 1, 2]
  return titles[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5]
  ]
}