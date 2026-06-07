import Link from 'next/link'
import { cn } from '@/lib/utils'
import { urgentCardsData, type HelpCardData } from './urgentCardsData'

interface UrgentCardsSectionProps {
  className?: string
  containerClass?: string
  cards?: HelpCardData[]
}

export default function UrgentCardsSection({
  className = '',
  containerClass = '',
  cards = urgentCardsData,
}: UrgentCardsSectionProps) {
  return (
    <section className={cn('relative', containerClass, className)}>
      {/* Заголовок секции */}
      <h2 className="text-3xl font-bold text-[#0A5D56] mb-8">Срочно нужно</h2>

      {/* Grid с карточками - 2 колонки на всех экранах */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((card) => {
          const IconComponent = card.icon
          return (
            <div
              key={card.title}
              className="
                group
                bg-white 
                rounded-2xl 
                p-6 
                shadow-sm 
                hover:shadow-lg 
                transition-all 
                duration-300 
                hover:-translate-y-1
                border border-transparent
                hover:border-[#0A5D56]/10
              "
            >
              {/* Иконка */}
              <div className="w-12 h-12 rounded-xl bg-[#0A5D56]/10 flex items-center justify-center mb-4 group-hover:bg-[#0A5D56]/20 transition-colors duration-300">
                <IconComponent size={22} className="text-[#0A5D56]" />
              </div>

              {/* Заголовок */}
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{card.title}</h3>

              {/* Описание */}
              <p className="text-sm text-[#6B7280] mb-6 line-clamp-2">{card.description}</p>

              {/* Разделитель */}
              <div className="border-t border-[#E5E7EB] pt-4">
                <Link
                  href={card.href}
                  className="
                    inline-flex 
                    items-center 
                    gap-2 
                    text-sm 
                    font-medium 
                    text-[#0A5D56] 
                    hover:text-[#0A5D56]/80 
                    transition-colors 
                    duration-300
                  "
                >
                  {card.linkText}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
