import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { UsefulArticleProps } from '@/shared/types/pageType/article.type'

export default function UsefulArticle({ containerClass = '', links = [] }: UsefulArticleProps) {
  if (!links || links.length === 0) return null

  return (
    <section className={containerClass}>
      <div className="bg-block">
        <div className="mb-6 text-lg font-semibold tracking-[0.12em] text-[#101828]">Полезно</div>
        <nav>
          <ul className="m-0 list-none space-y-3 p-0">
            {links.map((item, index) => (
              <li key={index} className="group">
                <Link
                  href={item.href}
                  className="
                    relative 
                    inline-block
                    text-main 
                    transition-all duration-300 ease-out
                    hover:text-main/80
                    group-hover:translate-x-1
                  "
                >
                  {item.label}

                  <span
                    className="
                      absolute bottom-0 left-0 h-[1.5px] 
                      bg-main w-full
                      transition-all duration-300 ease-out
                      group-hover:w-0
                    "
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
