import { CollectionsCard } from '@/components/ui/InfoCard'
import { cn } from '@/lib/utils'
import type { CollectionCardData } from '@/shared/types/componentsType/infoCard.type'
import type { BestArticleMinimal } from '@/shared/types'

function transformArticleToCard(article: BestArticleMinimal): CollectionCardData {
  const imageUrl = article.image?.url || ''
  const imageAlt = article.image?.alt || ''

  return {
    href: article.href || '',
    category: article.category || '',
    image: { url: imageUrl, alt: imageAlt },
    title: article.title || '',
    description: article.description || '',
  }
}

export default function BestSelections({
  data,
  className = '',
}: {
  data: CollectionCardData[] | BestArticleMinimal[]
  className?: string
}) {
  const transformedData: CollectionCardData[] = Array.isArray(data)
    ? data
        .filter((item): item is BestArticleMinimal => typeof item === 'object' && item !== null)
        .map(transformArticleToCard)
    : data

  return (
    <section className={cn('rounded-3xl', className)}>
      <div className="">
        <div className="flex items-center gap-2">
          <h2 className="title">Лучшие подборки</h2>
        </div>
        <CollectionsCard heightInPx={280} data={transformedData} />
      </div>
    </section>
  )
}
