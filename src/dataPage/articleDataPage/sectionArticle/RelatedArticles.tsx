import { CollectionsCardAccent } from '@/components/ui/InfoCard'
import Slider from '@/components/ui/Slider'
import type { RelatedArticlesProps } from '@/shared/types/pageType/article.type'

export default function RelatedArticles({ articles, containerClass = '' }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null

  return (
    <section className={containerClass}>
      <div className="flex items-end justify-between gap-4">
        <h2 className="title flex-1">Похожие статьи</h2>
      </div>

      <CollectionsCardAccent data={articles} />
    </section>
  )
}
