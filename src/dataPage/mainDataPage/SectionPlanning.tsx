import { Sun, BookType, Wallet, House, Plane, Map, Waves, Utensils } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TripPlanningCards } from '@/components/ui/InfoCard'
import Slider from '@/components/ui/Slider'
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

export default function Planning({
  data,
  containerClass = '',
}: {
  data: BestArticleMinimal[]
  containerClass?: string
}) {
  const infoCards = mapArticlesToCards(data)

  return (
    <section className={cn('', containerClass)}>
      <h2 className="title">Планируете поездку</h2>
      <Slider cols={{ 520: 2, lg: 3, xl: 4 }} gap="2rem">
        <TripPlanningCards arr={infoCards} />
      </Slider>
    </section>
  )
}
