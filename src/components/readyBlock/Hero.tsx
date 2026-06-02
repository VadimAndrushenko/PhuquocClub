import Image from 'next/image'
import { CalendarDays, Clock3, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import Breadcrumbs from '../ui/Breadcrumbs'
import SearchInput from '../ui/SearchInput'
import type { HeroProps } from '@/shared/types/blockType/hero.type'
import { PayloadMedia } from '@/shared/types/global.type'

// ============================================
// 🔧 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

/** Форматирует дату в русский формат */
function formatDate(dateString: string | undefined): string | null {
  if (!dateString) return null

  return new Date(dateString).toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric',
  })
}

// ============================================
// 🎯 КОМПОНЕНТ HERO
// ============================================

export default function Hero({
  dataHero,
  thisHeader = false,
  classes = {},
  className = '',
}: HeroProps) {
  const Tag = thisHeader ? 'header' : 'section'

  // Дата: приоритет updatedAt, fallback на createdAt
  const dateToShow = dataHero?.updatedAt || dataHero?.createdAt
  const updatedLabel = formatDate(dateToShow)

  // Показываем мета-блок только если есть что показывать
  const showMeta = dataHero?.readTime || updatedLabel || dataHero?.author

  return (
    <Tag
      className={cn(
        // 🔥 ОБЩИЕ классы
        'relative flex items-center justify-between gap-13 max-xl:justify-center',
        className,
        classes.container,
      )}
    >
      {/* Левая часть: текстовый контент */}
      <div className={cn('space-y-6', classes.content)}>
        {/* Категория */}
        {dataHero?.category && (
          <div
            className={cn('text-xs font-bold leading-5 text-accent uppercase', classes.category)}
          >
            {dataHero.category}
          </div>
        )}

        {/* Хлебные крошки */}
        {dataHero?.section && (
          <Breadcrumbs
            URL={{
              section: `${dataHero.section || 'blog'}`,
              ...(dataHero.subsection && { subsection: dataHero.subsection }),
              ...(dataHero.slug && { article: dataHero.slug }),
            }}
          />
        )}

        {/* Заголовок H1 */}
        <h1 className={cn('font-bold leading-[1.1] text-main', classes.title)}>
          {dataHero?.title || 'Заголовок'}
        </h1>

        {/* Описание */}
        {dataHero?.description && (
          <p
            className={cn(
              'leading-relaxed text-[#1E2939] font-medium text-xl text-wrap max-sm:text-lg',
              classes.description,
            )}
          >
            {dataHero.description}
          </p>
        )}

        {/* Мета-блок */}
        {showMeta && (
          <div
            className={cn(
              'flex min-[500px]:items-center text-nowrap gap-x-6 min-[500px]:border-y-2 min-[500px]:border-gray-100 text-sm text-paragraph max-[500px]:flex-col',
              classes.meta,
            )}
          >
            {dataHero?.readTime && (
              <span
                className={cn(
                  'inline-flex items-center gap-2 py-2 max-[500px]:border-t-2 max-[500px]:border-gray-100',
                  classes.metaItem,
                )}
              >
                <Clock3 size={16} className="text-accent" />
                {dataHero.readTime} мин чтения
              </span>
            )}

            {updatedLabel && (
              <span
                className={cn(
                  'inline-flex items-center gap-2 py-2 max-[500px]:border-y-2 max-[500px]:border-gray-100',
                  classes.metaItem,
                )}
              >
                <CalendarDays size={16} className="text-accent" />
                Обновлено: {updatedLabel}
              </span>
            )}

            {dataHero?.author && (
              <span
                className={cn(
                  'inline-flex items-center gap-2 py-2 max-[500px]:border-b-2 max-[500px]:border-gray-100',
                  classes.metaItem,
                )}
              >
                <User size={16} className="text-accent" />
                {dataHero.author}
              </span>
            )}
          </div>
        )}

        {/* Интро */}
        {dataHero?.intro && (
          <p className={cn('font-normal sm:text-lg leading-[1.6] text-[#4A5565]', classes.intro)}>
            {dataHero.intro}
          </p>
        )}

        {/* Поиск */}
        {dataHero?.search && (
          <div className={classes.search}>
            <SearchInput placeholder={dataHero.search.placeholder} tags={dataHero.search.tags} />
          </div>
        )}
      </div>

      {/* Правая часть: картинка */}
      <div className={cn('max-lg:hidden', classes.imageWrapper)}>
        {dataHero.image.url ? (
          <Image
            className={cn('rounded-4xl', classes.image)}
            src={dataHero.image.url}
            alt={dataHero.image.alt}
            width={472}
            height={420}
            priority
            unoptimized={process.env.NODE_ENV === 'development'}
          />
        ) : (
          <div className="bg-red-100 text-red-500 p-4 rounded">проверте url картинки</div>
        )}
      </div>
    </Tag>
  )
}
