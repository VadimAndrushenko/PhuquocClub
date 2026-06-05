
import { Sun, BookType, Wallet, House, Plane, Map, Waves, Utensils } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TripPlanning } from '@/components/ui/InfoCard'
import type { BestArticleMinimal } from '@/shared/types'

interface InfoCard {
  icon: LucideIcon
  title: string
  description: string
  href: string
  titleLink?: string
}

// Маппинг названий иконок на компоненты
const iconMap: Record<string, LucideIcon> = {
  Sun,
  BookType,
  Wallet,
  House,
  Plane,
  Map,
  Waves,
  Utensils,
}

// Маппинг статей на карточки с иконками
function mapArticlesToCards(articles: BestArticleMinimal[]): InfoCard[] {
  return articles.slice(0, 4).map((article) => {
    const IconComponent = article.icon ? iconMap[article.icon] : Sun
    return {
      icon: IconComponent || Sun,
      title: article.title || '',
      description: article.description || '',
      href: article.href || '/',
      titleLink: 'Подробнее',
    }
  })
}

export default function Urgent({
  data,
  containerClass = '',
}: {
  data: BestArticleMinimal[]
  containerClass?: string
}) {
  const infoCards = mapArticlesToCards(data)

  return (
    <section className="bg-urgent bg-cover bg-center py-20">
      <div className={cn('', containerClass)}>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="title text-white">Срочно нужно</h2>
        </div>

        <TripPlanning arr={infoCards} />
      </div>
    </section>
  )
}