import type { HeroArticleProps } from '@/shared/types/pageType/article.type'
import Hero from '@/components/readyBlock/Hero'

export default function HederArticle({ containerClass = '', dataArticle }: HeroArticleProps) {
  return (
    <Hero
      dataHero={dataArticle}
      thisHeader={true}
      classes={{
        // Уникальные классы для статьи
        container: `${containerClass} `,
        content: 'lg:max-w-[600px] lg:max-xl:max-w-[460px]',
        image: 'w-[472px] h-auth ',
      }}
    />
  )
}
