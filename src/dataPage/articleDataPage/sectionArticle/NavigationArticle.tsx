import Link from 'next/link'
import { cn, slugify } from '@/lib/utils'
import type { NavigationArticleProps } from '@/shared/types/pageType/article.type'

export default function NavigationArticle({ containerClass = '', blocks, locale = 'ru' }: NavigationArticleProps & { locale?: string }) {
  return (
    <section className={containerClass}>
      <div className="bg-block">
        <div className="mb-6 text-lg font-semibold tracking-[0.12em] text-[#101828]">{locale === 'en' ? 'In this article' : 'В статье'}</div>
        <nav>
          <ul className="border-l-2 border-gray-100 space-y-3">
            {blocks.map((item, i) => (
              <li key={i} className="group relative flex items-start gap-3 -translate-x-[4.5px]">
                <span
                  aria-hidden="true"
                  className="
                    relative mt-[6px] aspect-square w-2
                    rounded-full bg-white ring-2 ring-[#f3f4f6]
                    transition-all duration-300 ease-out
                    group-hover:scale-125 
                    group-hover:bg-main/70
                    group-hover:ring-main/30 
                    group-hover:translate-x-[7px]
                  "
                />

                <Link
                  href={`#${slugify(item.title)}`}
                  className="
                    block flex-1
                    text-paragraph
                    font-normal
                    text-[15px]
                    leading-normal
                    transition-all duration-300 ease-out
                    hover:font-semibold
                    hover:text-main
                    group-hover:translate-x-[7px]
                  "
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
