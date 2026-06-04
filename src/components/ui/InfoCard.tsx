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

function TripPlanning({ arr }: TripPlanningProps) {
  return (
    <Slider cols={{ 520: 2, lg: 3, xl: 4 }} gap="2rem">
      {arr.map((item) => {
        const Icon = item.icon

        return (
          <div
            key={item.href}
            className="flex flex-col p-6 rounded-[22px] min-h-[210px] shadow-[0_4px_24px_0_rgba(0,0,0,0.02)] bg-white"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center justify-center bg-[#004E4A0D] rounded-[14px] px-3 w-12 h-12">
                <Icon size={24} />
              </span>

              <h3 className="font-bold text-[22px] leading-[1.16667]">{item.title}</h3>
            </div>

            <p className="text-sm text-paragraph">{item.description}</p>

            <Link href={item.href} className="font-semibold flex items-center gap-1 group mt-auto">
              {item.titleLink ?? 'Подробнее'}
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        )
      })}
    </Slider>
  )
}

function PopularCards() {
  return (
    <Slider cols={{ md: 2, xl: 3 }} gap="2rem">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex gap-6 p-3 justify-between items-center bg-white rounded-[20px] w-[50wv] shadow-[0_4px_24px_0_rgba(0,0,0,0.04)]"
        >
          <div className="p-3 pr-0 flex flex-col h-full">
            <span className="text-accent font-bold text-xs leading-snug tracking-wider mb-3">
              ТРАНСПОРТ
            </span>
            <h3 className="font-bold text-xl leading-tight mb-2">Как арендовать байк на Фукуоке</h3>
            <p
              className="
                        text-paragraph max-h-[60px] overflow-y-auto 
                        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mb-2
                    "
            >
              Условия аренды, цены, документы и важные советы для безопасной езды.
            </p>
            <span className="flex gap-1.5 text-[#90A1B9] font-medium text-xs leading-[1.33333] mt-auto">
              <Clock size={14} />6 мин чтения
            </span>
          </div>
          <div className="relative w-[90px] h-[120px] sm:w-[110px] sm:h-[196px] shrink-0">
            <Image
              src="/ImageWithFallback.png"
              alt="WithFallback"
              fill
              className="object-cover rounded-xl"
              unoptimized={process.env.NODE_ENV === 'development'}
            />
          </div>
        </div>
      ))}
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
          <div
            style={{ height: `${heightInPx}px` }}
            key={i}
            className={`group relative rounded-[22px] p-6 overflow-hidden`}
          >
            {hasImage ? (
              <Image
                src={imgUrl}
                alt={imgAlt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
                unoptimized={process.env.NODE_ENV === 'development'}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200">
                <span className="text-gray-500">Изображение отсутствует</span>
              </div>
            )}

            <div className="relative z-10 flex h-full flex-col justify-between text-white">
              <div className="flex items-start justify-between">
                {item.category && (
                  <span className="font-bold text-white text-[11px] leading-normal uppercase py-1.5 px-3.5 rounded-full text-xs items-center gap-x-1 bg-[#3c383d79] backdrop-blur-sm border border-white/20">
                    {item.category}
                  </span>
                )}

                <span className="font-bold text-xl leading-[1.4] text-white/50">{i + 1}</span>
              </div>

              <div className="flex items-end justify-between gap-6">
                <div>
                  <h3 className="font-bold text-2xl leading-[1.33333] mb-2">{item.title}</h3>
                  <p className="text-sm leading-[1.42857] opacity-80">{item.description}</p>
                </div>

                <Link
                  href={item.href}
                  className="flex shrink-0 items-center justify-center h-11 w-11 rounded-full bg-white text-black group/btn"
                >
                  <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>

            {bg && <div className={cn(bg, 'absolute inset-0')}></div>}
          </div>
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
