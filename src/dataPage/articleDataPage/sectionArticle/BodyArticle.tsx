import { slugify } from '@/lib/utils'
import { ContentComponents } from '@/components/ui/ContentComponents'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { BodyArticleProps } from '@/shared/types/pageType/article.type'

export default function BodyArticle({ containerClass = '', contentArticle, locale = 'ru' }: BodyArticleProps & { locale?: string }) {
  return (
    <>
      {contentArticle.map((item, index) => {
        const Component =
          item.typeContent && ContentComponents[item.typeContent as keyof typeof ContentComponents]

        return (
          <section id={slugify(item.title)} key={index} className={containerClass}>
            <h2 className="font-bold text-[44px] leading-tight mb-6 max-md:text-[7.3vw]">
              {item.title}
            </h2>

            {item.description && (
              <div className="font-normal text-xl leading-[1.6] text-[#364153] max-[500px]:text-lg prose prose-lg max-w-none">
                <RichText data={item.description} />
              </div>
            )}

            {Component && <Component item={item} locale={locale} />}

            {item.descriptionAfter && (
              <div className="font-normal text-xl leading-[1.6] text-[#364153] max-[500px]:text-lg prose prose-lg max-w-none mt-6">
                <RichText data={item.descriptionAfter} />
              </div>
            )}
          </section>
        )
      })}
    </>
  )
}
