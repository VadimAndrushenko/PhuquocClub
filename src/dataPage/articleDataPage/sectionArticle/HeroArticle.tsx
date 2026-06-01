
import type { HeroArticleProps } from '@/shared/types/article.type'
import Hero from '@/components/readyBlock/Hero'

export default function HederArticle({
  containerClass = '',
  dataArticle,
}: HeroArticleProps) {

  return (
    <Hero
      dataHero={dataArticle}
      thisHeader={true}
      classes={{
        // Уникальные классы для статьи
        container: `${containerClass} `,
        content: 'lg:max-w-[600px] lg:max-xl:max-w-[460px]',
        title: 'text-5xl max-sm:text-[8vw]',
        image:'w-[472px] h-auth '
      }}
    />
  )
}