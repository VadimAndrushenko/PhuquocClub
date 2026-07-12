import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import type { HelpCardData } from '@/lib/transformData/helpPageTransform'

interface CardGridSectionProps {
  title: string
  cards: HelpCardData[]
  columns?: 2 | 3
  containerClass?: string
  className?: string
}

export default function CardGridSection({
  title,
  cards,
  columns = 2,
  containerClass = '',
  className = '',
}: CardGridSectionProps) {
  if (!cards.length) return null

  return (
    <section className={cn('relative', containerClass, className)}>
      <h2 className="text-3xl font-bold text-[#0A5D56] mb-8">{title}</h2>

      <div
        className={cn(
          'grid gap-6',
          columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {cards.map((card) => {
          const IconComponent = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-[#0A5D56]/10 block"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0A5D56]/10 flex items-center justify-center mb-4 group-hover:bg-[#0A5D56]/20 transition-colors duration-300">
                <IconComponent size={22} className="text-[#0A5D56]" />
              </div>

              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{card.label}</h3>

              <p className="text-sm text-[#6B7280] mb-6 line-clamp-2">{card.description}</p>

              <div className="border-t border-[#E5E7EB] pt-4">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[#0A5D56] group-hover:text-[#0A5D56]/80 transition-colors duration-300">
                  {card.linkLabel}
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
