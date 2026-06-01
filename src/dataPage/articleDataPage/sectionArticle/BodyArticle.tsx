import { slugify } from '@/lib/utils'
import { ContentComponents } from '../articleComponents/ContentComponents'
import type { BodyArticleProps } from '@/shared/types/article.type'

export default function BodyArticle({
  containerClass = '',
  contentArticle,
}: BodyArticleProps) {
  return (
    <>
      {contentArticle.map((item, index) => {
        const Component =
          item.typeContent &&
          ContentComponents[item.typeContent as keyof typeof ContentComponents]

        return (
          <section id={slugify(item.title)} key={index} className={containerClass}>
            <h2 className="font-bold text-[44px] leading-tight mb-6 max-md:text-[7.3vw]">
              {item.title}
            </h2>

            <p className="font-normal text-xl leading-[1.6] text-[#364153] max-[500px]:text-lg">
              {item.description}
            </p>

            {Component && <Component item={item} />}
          </section>
        )
      })}
    </>
  )
}