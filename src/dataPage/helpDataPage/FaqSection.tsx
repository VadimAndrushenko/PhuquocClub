'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import type { FaqItemData } from '@/lib/transformData/helpPageTransform'

interface FaqSectionProps {
  className?: string
  containerClass?: string
  items?: FaqItemData[]
  title?: string
  locale?: string
}

export default function FaqSection({
  className = '',
  containerClass = '',
  items = [],
  title,
  locale = 'ru',
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      className={cn(
        'relative',
        containerClass,
        className,
      )}
    >
      {/* Заголовок секции */}
      <h2 className="text-3xl font-bold text-[#0A5D56] mb-8 text-center">
        {title || (locale === 'en' ? 'Popular questions' : 'Популярные вопросы')}
      </h2>

      {/* Список вопросов */}
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        {items.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div
              key={index}
              className="
                bg-white 
                rounded-2xl 
                border border-[#E5E7EB]
                overflow-hidden
                transition-all 
                duration-300
              "
            >
              {/* Заголовок вопроса (кнопка) */}
              <button
                type="button"
                onClick={() => toggleItem(index)}
                className="
                  w-full 
                  px-6 
                  py-5 
                  flex 
                  items-center 
                  justify-between 
                  gap-4
                  text-left
                  hover:bg-[#F9FAFB]
                  transition-colors
                  duration-200
                "
                aria-expanded={isOpen}
              >
                <span className="font-medium text-[#1A1A1A] text-base">
                  {item.question}
                </span>
                <ChevronDown
                  size={20}
                  className={cn(
                    'text-[#0A5D56] shrink-0 transition-transform duration-300',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>

              {/* Ответ */}
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300 ease-in-out',
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
                )}
              >
                <div className="px-6 pb-5 text-sm text-[#6B7280] leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
