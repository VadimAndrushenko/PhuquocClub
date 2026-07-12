import { CollectionsCard } from '@/components/ui/InfoCard'
import { cn } from '@/lib/utils'
import type { CollectionCardData } from '@/lib/transformData/homePageTransform'

export default function Collections({
  data,
  containerClass = '',
  locale = 'ru',
}: {
  data: CollectionCardData[]
  containerClass?: string 
  locale?: string
}) {
  return (
    <section className={cn('rounded-3xl', containerClass)}>
      <div className="">
        <div className="flex items-center gap-2">
          <h2 className="title">{locale === 'en' ? 'Best collections' : 'Лучшие подборки'}</h2>
        </div>
        <CollectionsCard heightInPx={280} data={data} locale={locale} />
      </div>
    </section>
  )
}