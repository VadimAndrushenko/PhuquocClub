import { cn } from '@/lib/utils'
import { PopularCards } from '@/components/ui/InfoCard'
import type { BestArticleMinimal } from '@/shared/types'

export default function Popular({
  data,
  containerClass = '',
}: {
  data: BestArticleMinimal[]
  containerClass?: string
}) {
  return (
    <section className={cn('', containerClass)}>
      <h2 className="title">Популярные</h2>
      <PopularCards data={data} />
    </section>
  )
}