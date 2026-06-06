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

function TripPlanning({ arr }: TripPlanningProps) {
  return (
    <Slider cols={{ 520: 2, lg: 3, xl: 4 }} gap="2rem">
      {arr.map((item) => {
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col p-6 rounded-[22px] min-h-[210px] shadow-[0_4px_24px_0_rgba(0,0,0,0.02)] bg-white hover:-translate-y-3 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] transition-all duration-500 ease-out"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center justify-center bg-[#004E4A0D] rounded-[14px] px-3 w-12 h-12 group-hover:scale-110 transition-transform duration-300">
                <Icon size={24} className="group-hover:text-accent transition-colors" />
              </span>

              <h3 className="font-bold text-[22px] leading-[1.16667] group-hover:text-accent transition-colors">
                {item.title}
              </h3>
            </div>

            <p className="text-sm text-paragraph flex-1">{item.description}</p>

            <div className="font-semibold flex items-center gap-1 mt-auto group-hover:text-accent transition-colors">
              {item.titleLink ?? 'Подробнее'}
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </div>
          </Link>
        )
      })}
    </Slider>
  )
}

function PopularCards({ data }: { data: BestArticleMinimal[] }) {
  return (
    <Slider cols={{ md: 2, xl: 3 }} gap="2rem">
      {data.slice(0, 3).map((item, i) => {
        const imgUrl = item.image?.url || ''
        const imgAlt = item.image?.alt || item.title || ''

        return (
          <Link
            key={item.id}
            href={item.href || '#'}
            className="group flex gap-6 p-3 justify-between items-center bg-white rounded-[20px] shadow-[0_4px_24px_0_rgba(0,0,0,0.04)] hover:-translate-y-3 hover:shadow-[0_10px_40px_0_rgba(0,0,0,0.1)] transition-all duration-500 ease-out overflow-hidden"
          >
            <div className="p-3 pr-0 flex flex-col h-full flex-1">
              <span className="text-accent font-bold text-xs leading-snug tracking-wider mb-3 uppercase">
                {item.category || 'КАТЕГОРИЯ'}
              </span>
              <h3 className="font-bold text-xl leading-tight mb-2 group-hover:text-accent transition-colors">
                {item.title}
              </h3>
              <p
                className="
                        text-paragraph max-h-[60px] overflow-y-auto 
                        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mb-2 flex-1
                    "
              >
                {item.description}
              </p>
              <span className="flex gap-1.5 text-[#90A1B9] font-medium text-xs leading-[1.33333] mt-auto">
                <Clock size={14} />
                {item.readTime || '5 мин чтения'}
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

function CollectionsCard({ data, bg, heightInPx }: CollectionsCardProps) {
  return (
    <Slider cols={{ sm: 2, lg: 3 }} gap="2rem">
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
            className="group relative rounded-[22px] overflow-hidden hover:-translate-y-3 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-500 ease-out block"
            style={{ height: `${heightInPx}px` }}
          >
            {hasImage ? (
              <Image
                src={imgUrl}
                alt={imgAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                unoptimized={process.env.NODE_ENV === 'development'}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200">
                <span className="text-gray-500">Изображение отсутствует</span>
              </div>
            )}

            <div className="relative z-10 flex h-full flex-col justify-between text-white p-6">
              <div className="flex items-start justify-between">
                {item.category && (
                  <span className="font-bold text-white text-[11px] leading-normal uppercase py-1.5 px-3.5 rounded-full text-xs items-center gap-x-1 bg-[#3c383d79] backdrop-blur-sm border border-white/20 ">
                    {item.category}
                  </span>
                )}

                <span className="font-bold text-xl leading-[1.4] text-white/50">
                  {item.number || i + 1}
                </span>
              </div>

              <div className="flex items-end justify-between gap-6">
                <div>
                  {/* 👇 ИЗМЕНЕНИЕ ЗДЕСЬ: group-hover:text-accent и duration-300 */}
                  <h3 className="font-bold text-2xl leading-[1.33333] mb-2 group-hover:text-accent transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-[1.42857] opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    {item.description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center justify-center h-11 w-11 rounded-full bg-white text-black group/btn hover:bg-accent hover:text-white transition-all duration-300">
                  <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                </div>
              </div>
            </div>

            {bg && <div className={cn(bg, 'absolute inset-0')}></div>}
          </Link>
        )
      })}
    </Slider>
  )
}

function CollectionsCardAccent({ data, className = '' }: CollectionsCardAccentProps) {
  return (
    <>
      {data.map((item: CollectionsCardAccentData) => (
        <Link
          key={item.href}
          href={item.href}
          className={`group relative bg-white rounded-[22px] overflow-hidden shadow-[0_4px_24px_0_rgba(0,0,0,0.05)] hover:-translate-y-3 transition-all duration-500 ease-out flex flex-col h-full ${className}`}
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
                  проверте изоброжения и alt(описания для картинки)
                </span>
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col flex-1">
            <h3 className="font-bold text-2xl leading-snug mb-3 group-hover:text-accent transition-colors min-[520px]:max-sm:text-xl">
              {item.title}
            </h3>

            <p className="text-paragraph font-normal leading-relaxed mb-4 flex-1 line-clamp-3">
              {item.description}
            </p>

            <div className="flex items-center justify-between text-sm font-semibold text-foreground mt-auto">
              <span className="group-hover:text-accent transition-colors flex items-center gap-1.5">
                Читать статью
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>

              {item.readTime && (
                <span className="text-xs text-muted-foreground">{item.readTime}</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </>
  )
}

export { TripPlanning, PopularCards, CollectionsCard, CollectionsCardAccent }