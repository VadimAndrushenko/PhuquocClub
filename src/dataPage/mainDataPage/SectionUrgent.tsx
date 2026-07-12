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
  return articles.map((article) => {
    const IconComponent = article.icon ? iconMap[article.icon] : Sun
    return {
      icon: IconComponent || Sun,
      title: article.title || '',
      description: article.description || '',
      href: article.href || '/',
    }
  })
}

export default function Urgent({
  data,
  containerClass = '',
  locale = 'ru',
}: {
  data: BestArticleMinimal[]
  containerClass?: string
  locale?: string
}) {
  const infoCards = mapArticlesToCards(data)

  return (
    <section className="bg-urgent bg-cover bg-center py-20">
      <div className={cn('', containerClass)}>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="title text-white">{locale === 'en' ? 'Urgent' : 'Срочно нужно'}</h2>
        </div>

        <Slider cols={{ 520: 2, lg: 3, xl: 4 }} gap="2rem" locale={locale}>
          <TripPlanningCards arr={infoCards} locale={locale} />
        </Slider>
      </div>
    </section>
  )
}
