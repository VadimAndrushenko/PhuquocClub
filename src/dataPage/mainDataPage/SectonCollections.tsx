import { CollectionsCard } from '@/components/ui/InfoCard'
import { cn } from '@/lib/utils'
import type { CollectionCardData } from '@/lib/transformData/homePageTransform'

export default function Collections({
  data,
  containerClass = '',
}: {
  data: CollectionCardData[]
  containerClass?: string 
}) {
  return (
    <section className={cn('rounded-3xl', containerClass)}>
      <div className="">
        <div className="flex items-center gap-2">
          <h2 className="title">Лучшие подборки</h2>
        </div>
        <CollectionsCard heightInPx={280} data={data} />
      </div>
    </section>
  )
}