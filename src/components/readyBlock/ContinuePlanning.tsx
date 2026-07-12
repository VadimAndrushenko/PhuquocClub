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

export default function ContinuePlanning({
  data,
  className = '',
  locale = 'ru',
}: {
  data: BestArticleMinimal[]
  className?: string
  locale?: string
}) {
  const transformedData: CollectionCardData[] = Array.isArray(data)
    ? data
        .filter((item): item is BestArticleMinimal => typeof item === 'object' && item !== null)
        .map(transformArticleToCard)
    : []

  return (
    <section className={cn('rounded-3xl', className)}>
      <div className="">
        <div className="flex items-center gap-2">
          <h2 className="title">{locale === 'en' ? 'Continue planning' : 'Продолжить планирование'}</h2>
        </div>
        <CollectionsCard
          bg="bg-[linear-gradient(0deg,_rgba(0,78,74,0.9)_0%,_rgba(0,78,74,0.3)_50%,_rgba(0,0,0,0)_100%)]"
          heightInPx={280}
          data={transformedData}
          locale={locale}
        />
      </div>
    </section>
  )
}
