import { CollectionsCardAccent } from '@/components/ui/InfoCard'
import Slider from '@/components/ui/Slider'
import type { RelatedArticlesProps } from '@/shared/types/pageType/article.type'

export default function RelatedArticles({ articles, containerClass = '', locale = 'ru' }: RelatedArticlesProps & { locale?: string }) {
  if (!articles || articles.length === 0) return null

  return (
    <section className={containerClass}>
      <div className="flex items-end justify-between gap-4">
        <h2 className="title flex-1">{locale === 'en' ? 'Related articles' : 'Похожие статьи'}</h2>
      </div>

      <Slider cols={{ 520: 2, lg: 3 }} locale={locale}>
        <CollectionsCardAccent data={articles} locale={locale} />
      </Slider>
      
    </section>
  )
}
