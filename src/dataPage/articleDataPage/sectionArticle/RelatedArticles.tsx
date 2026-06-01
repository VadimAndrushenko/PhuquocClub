import { CollectionsCardAccent } from '@/components/ui/InfoCard'
import Slider from '@/components/ui/Slider'
import type { RelatedArticlesProps } from '@/shared/types/article.type'


export default function RelatedArticles({
  articles,
  containerClass = '',
}: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null

  return (
    <section className={containerClass}>
      <div className="flex items-end justify-between gap-4">
        <h2 className="title flex-1">Похожие статьи</h2>
      </div>

      <Slider cols={{ 520: 2, lg: 3 }}>
        {articles.map((article) => (
          <CollectionsCardAccent
            key={article.id}
            href={article.href}
            category={article.category}
            image={article.image}
            title={article.title}
            description={article.description}
            readTime={article.readTime}
          />
        ))}
      </Slider>
    </section>
  )
}