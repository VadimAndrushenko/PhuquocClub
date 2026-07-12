import Link from 'next/link'
import { type LucideIcon, ArrowRight, Clock, UtensilsCrossed } from 'lucide-react'
import Image from 'next/image'
import Slider from './Slider'
import { cn } from '@/lib/utils'
import type {
  TripPlanningProps,
  CollectionsCardAccentData,
  CollectionsCardAccentProps,
  CollectionCardData,
  CollectionsCardProps,
} from '@/shared/types/componentsType/infoCard.type'
import type { BestArticleMinimal } from '@/shared/types'

function TripPlanningCards({ arr, locale = 'ru' }: TripPlanningProps & { locale?: string }) {
  return arr.map((item) => {
    const Icon = item.icon

    return (
      <Link
        key={item.href}
        href={item.href}
        className="group flex flex-col gap-y-4 p-6 rounded-[22px] min-h-[210px] shadow-[0_4px_24px_0_rgba(0,0,0,0.04)] bg-white hover:-translate-y-3 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] transition-all duration-500 ease-out h-full"
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center justify-center bg-main/5 rounded-[14px] px-3 w-12 h-12 group-hover:scale-110 transition-transform duration-300">
            <Icon size={24} className="group-hover:text-accent transition-colors" />
          </span>

          <div className="flex items-center h-[77px]">
            <h3 className="font-bold text-[22px] leading-[1.16667] group-hover:text-accent transition-colors line-clamp-3" title={item.title ?? ''}>
              {item.title}
            </h3>
          </div>
        </div>

        <p className="scroll-shadow max-h-16 text-sm text-paragraph flex-1">{item.description}</p>

        <div className="font-semibold flex items-center gap-1 mt-auto group-hover:text-accent transition-colors">
          {locale === 'en' ? 'Read more' : 'Подробнее'}
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </Link>
    )
  })
}

function PopularCards({ data, locale = 'ru' }: { data: BestArticleMinimal[]; locale?: string }) {
  return (
    <Slider cols={{ md: 2, xl: 3 }} gap="2rem" locale={locale}>
      {data.map((item, i) => {
        const imgUrl = item.image?.url || ''
        const imgAlt = item.image?.alt || item.title || ''

        return (
          <Link
            key={item.id}
            href={item.href }
            className="group flex gap-6 p-3 justify-between items-center bg-white rounded-[22px] shadow-[0_4px_24px_0_rgba(0,0,0,0.04)] hover:-translate-y-3 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] transition-all duration-500 ease-out overflow-hidden h-full"
          >
            <div className="p-3 pr-0 flex flex-col gap-y-3 h-full flex-1">
              <span className="text-accent font-bold text-xs leading-snug tracking-wider  uppercase">
                {item.category || (locale === 'en' ? 'CATEGORY' : 'КАТЕГОРИЯ')}
              </span>
              <h3 className="font-bold text-xl leading-tight  group-hover:text-accent transition-colors min-h-[75px] line-clamp-3" title={item.title ?? ''}>
                {item.title}
              </h3>
              <p className="scroll-shadow text-paragraph max-h-[65px] flex-1">
                {item.description}
              </p>
              <span className="flex gap-1.5 text-paragraph/60 font-medium text-xs leading-[1.33333] mt-auto">
                <Clock size={14} />
                {item.readTime ? `${item.readTime} ${locale === 'en' ? 'min read' : 'мин чтения'}` : (locale === 'en' ? '5 min read' : '5 мин чтения')} 
              </span>
            </div>
            <div className="relative w-[90px] h-[120px] sm:w-[110px] sm:h-[196px] shrink-0 overflow-hidden rounded-xl">
              {imgUrl ? (
                <Image
                  src={imgUrl}
                  alt={imgAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized={process.env.NODE_ENV === 'development'}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-xl" />
              )}
            </div>
          </Link>
        )
      })}
    </Slider>
  )
}

function CollectionsCard({ data, bg, heightInPx, locale = 'ru' }: CollectionsCardProps & { locale?: string }) {
  return (
    <Slider cols={{ sm: 2, lg: 3 }} gap="2rem" locale={locale}>
      {data.map((item: CollectionCardData, i: number) => {
        const imgUrl =
          item.image && typeof item.image === 'object' && item.image !== null
            ? item.image.url
            : undefined
        const imgAlt =
          item.image && typeof item.image === 'object' && item.image !== null
            ? item.image.alt
            : undefined
        const hasImage = imgUrl && imgAlt

        return (
          <Link
            href={item.href}
            key={item.id || i}
            className="group relative rounded-[22px] overflow-hidden hover:-translate-y-3 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] transition-all duration-500 ease-out block"
            style={{ height: `${heightInPx}px` }}
          >
            {hasImage ? (
              <Image
                src={imgUrl}
                alt={imgAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                unoptimized={process.env.NODE_ENV === 'development'}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200">
                <span className="text-gray-500">{item.title || (locale === 'en' ? 'Image unavailable' : 'Изображение недоступно')} — Phuquoc.Club</span>
              </div>
            )}

            <div className="relative z-20 flex h-full flex-col text-white p-6">
              {item.category && (
                <div className="font-bold self-start text-white text-[11px] leading-normal uppercase py-1.5 px-3.5 rounded-full text-xs items-center gap-x-1 bg-black/30 backdrop-blur-sm border border-white/20 ">
                  {item.category}
                </div>
              )}

              <div className="flex flex-col gap-3 mt-auto">
                
                <h3 className="font-bold text-white text-2xl leading-[1.33333] mb-2 group-hover:text-accent transition-colors duration-300 leading-8 min-h-[64px] line-clamp-2" title={item.title ?? ''}>
                  {item.title}
                </h3>

                <div className="flex justify-between gap-3">
                  <p className="text-sm text-white/80 leading-[1.42857] opacity-80 group-hover:opacity-100 transition-opacity duration-300 min-h-20 line-clamp-4" title={item.description ?? ''}>
                    {item.description}
                  </p>
                  

                  <div className="flex shrink-0 items-center justify-center h-11 w-11 rounded-full bg-white text-black group-hover-card-btn transition-all duration-300 self-end">
                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>

            <div className={cn(bg ?? 'bg-[linear-gradient(0deg,_rgba(0,0,0,0.8)_0%,_rgba(0,0,0,0.4)_50%,_rgba(0,0,0,0.1)_100%)]', 'absolute inset-0 z-10')}></div>
          </Link>
        )
      })}
    </Slider>
  )
}

function CollectionsCardAccent({ data, className = '', locale = 'ru' }: CollectionsCardAccentProps & { locale?: string }) {
  return (
    <>
      {data.map((item: CollectionsCardAccentData) => (
        <Link
          key={item.href}
          href={item.href}
          className={`group relative bg-white rounded-[22px] overflow-hidden shadow-[0_4px_24px_0_rgba(0,0,0,0.04)] hover:-translate-y-3 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] transition-all duration-500 ease-out flex flex-col h-full ${className}`}
        >
          {item.category && (
            <div className="absolute top-4 left-4 z-10">
              <span className="font-bold text-main text-[11px] leading-normal uppercase rounded-full py-1.5 px-3.5 shadow bg-white/95 transition-colors group-hover:bg-white">
                {item.category}
              </span>
            </div>
          )}

          <div className="relative h-55 w-full">
            {item.image &&
            typeof item.image === 'object' &&
            item.image !== null &&
            item.image.url &&
            item.image.alt ? (
              <Image
                src={item.image.url}
                alt={item.image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized={process.env.NODE_ENV === 'development'}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200">
                <span className="text-gray-500">
                  {locale === 'en' ? 'Check image and alt text' : 'проверте изоброжения и alt(описания для картинки)'}
                </span>
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col flex-1">
            <h3 className="font-bold text-2xl leading-snug mb-3 group-hover:text-accent transition-colors min-[520px]:max-sm:text-xl" title={item.title ?? ''}>
              {item.title}
            </h3>

            <p className="text-paragraph font-normal leading-relaxed mb-4 flex-1 line-clamp-3" title={item.description ?? ''}>
              {item.description}
            </p>

            <div className="flex items-center justify-between text-sm font-semibold text-foreground mt-auto">
              <span className="group-hover:text-accent transition-colors flex items-center gap-1.5">
                {locale === 'en' ? 'Read article' : 'Читать статью'}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>

              {item.readTime && (
                <span className="text-xs text-muted-foreground group-hover:text-accent">{item.readTime} {locale === 'en' ? 'min' : 'мин'}</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </>
  )
}

export {  TripPlanningCards, PopularCards, CollectionsCard, CollectionsCardAccent }
