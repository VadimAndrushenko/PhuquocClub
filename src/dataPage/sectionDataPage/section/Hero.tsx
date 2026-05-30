import Image from 'next/image'
import { CalendarDays, Clock3, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import type { HederArticleProps } from '@/shared/types/article.type'
import SearchInput from '@/components/ui/SearchInput'

const article = {
  section: 'on-island',
  title: 'На острове',
  description:
    'Рестораны, кафе, рынки и локальные места, которые стоит знать туристу',
  intro:
    'Собрали проверенные места, районы, цены, советы по выбору кухни и подборки для разных сценариев: завтрак, ужин, морепродукты, кофе и локальная еда.',
  category: 'ЕДА НА ФУКУОКЕ',
  readTime: '8 мин',
  author: 'Phuquoc.Club',
  updatedAt: '2026-05-29T10:00:00.000Z',
  createdAt: '2026-05-15T08:00:00.000Z',
  image: {
    url: '/hero-sunset.jpg',
    alt: 'Закат на Фукуоке',
  },
}

export default function Hero({
  className = '',
//   article,
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
        'relative flex max-lg:flex-col lg:items-center justify-between gap-13 max-xl:justify-center',
        className
      )}
    >
      <div className="space-y-6 lg:max-w-[550px] lg:max-xl:max-w-[430px]">
        {article.category && (
          <div className="text-xs font-bold leading-5 text-accent uppercase">
            {article.category}
          </div>
        )}

        <Breadcrumbs
          URL={{
            section: `${article.section || 'blog'}`,
            ...(article.subsection && { subsection: article.subsection || 'articles' }),
           ...(article.slug && {article: `${article.slug}`}),
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

        {article.intro && (
          <p className="font-normal sm:text-lg leading-[1.6] text-[#4A5565]">
            {article.intro}
          </p>
        )}
        <SearchInput 
            placeholder="Поиск по сайту: пляжи, отели, еда, транспорт..."
            tags={true}
        />
      </div>

      <div className=" max-lg:hidden">
        <Image
          className="rounded-4xl "
          src="/hero-image.jpg"
          alt={imageAlt}
          width={620}
          height={520}
          priority
          unoptimized={process.env.NODE_ENV === 'development'}
        />
      </div>
    </header>
  )
}