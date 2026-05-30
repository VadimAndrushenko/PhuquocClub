import Image from 'next/image'
import { CalendarDays, Clock3, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import type { HederArticleProps } from '@/shared/types/article.type'

export default function HederArticle({
  className = '',
  article,
}: HederArticleProps) {
  const imageUrl =
    typeof article.image === 'object' && article.image
      ? article.image.url
      : (article.image as string) || '/hero-image-article.jpg'

  const imageAlt =
    typeof article.image === 'object' && article.image
      ? article.image.alt || article.title || ''
      : article.title || ''

  const dateToShow = article.updatedAt || article.createdAt
  const updatedLabel = dateToShow
    ? new Date(dateToShow).toLocaleDateString('ru-RU', {
        month: 'long',
        year: 'numeric',
      })
    : 'недавно'

  return (
    <header
      className={cn(
        'relative flex max-lg:flex-col lg:items-center justify-between gap-13 overflow-hidden max-xl:justify-center',
        className
      )}
    >
      <div className="space-y-6">
        {article.category && (
          <div className="text-xs font-bold leading-5 text-accent uppercase">
            {article.category}
          </div>
        )}

        <Breadcrumbs
          URL={{
            section: `${article.section || 'blog'}`,
            subsection: `${article.subsection || 'articles'}`,
            article: `${article.slug}`,
          }}
        />

        <h1 className="text-5xl font-bold leading-[1.1] text-main max-sm:text-[8vw]">
          {article.title || 'Заголовок статьи'}
        </h1>

        {article.description && (
          <p className="font-medium text-xl leading-relaxed text-wrap text-[#1E2939] max-sm:text-lg">
            {article.description}
          </p>
        )}

        <div className="flex min-[500px]:items-center gap-x-6 min-[500px]:border-y-2 min-[500px]:border-gray-100 text-sm text-paragraph max-[500px]:flex-col">
          {article.readTime && (
            <span className="inline-flex items-center gap-2 py-2 max-[500px]:border-t-2 max-[500px]:border-gray-100">
              <Clock3 size={16} className="text-accent" />
              {article.readTime} мин чтения
            </span>
          )}

          <span className="inline-flex items-center gap-2 py-2 max-[500px]:border-y-2 max-[500px]:border-gray-100">
            <CalendarDays size={16} className="text-accent" />
            Обновлено: {updatedLabel}
          </span>

          {article.author && (
            <span className="inline-flex items-center gap-2 py-2 max-[500px]:border-b-2 max-[500px]:border-gray-100">
              <User size={16} className="text-accent" />
              {article.author}
            </span>
          )}
        </div>

        {article.intro && (
          <p className="font-normal sm:text-lg leading-[1.6] text-[#4A5565]">
            {article.intro}
          </p>
        )}
      </div>

      <div className="shrink-0 max-lg:hidden">
        <Image
          className="rounded-4xl"
          src={imageUrl}
          alt={imageAlt}
          width={472}
          height={420}
          priority
          unoptimized={process.env.NODE_ENV === 'development'}
        />
      </div>
    </header>
  )
}