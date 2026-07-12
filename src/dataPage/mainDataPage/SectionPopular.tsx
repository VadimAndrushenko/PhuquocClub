import { cn } from '@/lib/utils'
import { PopularCards } from '@/components/ui/InfoCard'
import type { BestArticleMinimal } from '@/shared/types'

export default function Popular({
  data,
  containerClass = '',
  locale = 'ru',
}: {
  data: BestArticleMinimal[]
  containerClass?: string
  locale?: string
}) {
  return (
    <section className={cn('', containerClass)}>
      <h2 className="title">{locale === 'en' ? 'Popular' : 'Популярные'}</h2>
      <PopularCards data={data} locale={locale} />
    </section>
  )
}