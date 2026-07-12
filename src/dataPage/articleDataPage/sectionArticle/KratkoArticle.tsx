import { cn } from '@/lib/utils'
import type { KratkoArticleProps } from '@/shared/types/pageType/article.type'

export default function KratkoArticle({ containerClass = '', items, locale = 'ru' }: KratkoArticleProps & { locale?: string }) {
  return (
    <section className={cn(containerClass)}>
      <div className="bg-block">
        <h3 className="mb-6 text-lg font-semibold uppercase tracking-[0.12em] text-[#101828]">
          {locale === 'en' ? 'In brief' : 'Коротко'}
        </h3>

        <div className="grid gap-6 min-[500px]:grid-cols-2">
          {items.map((item, index) => {
            const Icon = item.icon

            return (
              <div key={index} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f9fafb] text-accent">
                  <Icon size={20} />
                </div>

                <div className="min-w-0">
                  <div className="font-medium text-sm leading-normal text-[#6a7282]">
                    {item.label}
                  </div>
                  <div className="font-semibold leading-[1.375] text-[#101828] max-md:text-[15px]">
                    {item.value}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
