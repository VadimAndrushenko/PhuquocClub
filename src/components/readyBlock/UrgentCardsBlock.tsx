import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Car, Pill, Wifi, ShoppingBag, Phone, Shield, FileText, HelpCircle, type LucideIcon } from 'lucide-react'

export interface HelpCardData {
  icon: LucideIcon
  title: string
  description: string
  linkText: string
  href: string
}

interface UrgentCardsBlockProps {
  className?: string
  containerClass?: string
  cards?: HelpCardData[]
}

const defaultCards: HelpCardData[] = [
  {
    icon: Car,
    title: 'Такси',
    description: 'Как заказать машину, какие приложения работают и сколько примерно стоит поездка.',
    linkText: 'Найти такси',
    href: '/help/taxi',
  },
  {
    icon: Pill,
    title: 'Аптека',
    description: 'Где искать аптеки, как объяснить проблему и что взять с собой.',
    linkText: 'Найти аптеку',
    href: '/help/pharmacy',
  },
  {
    icon: Wifi,
    title: 'Интернет',
    description: 'SIM-карты, eSIM, мобильный интернет и Wi-Fi на острове.',
    linkText: 'Подключиться',
    href: '/help/internet',
  },
  {
    icon: ShoppingBag,
    title: 'Магазины',
    description: 'Супермаркеты, рынки, товары первой необходимости и график работы.',
    linkText: 'Смотреть магазины',
    href: '/help/shops',
  },
  {
    icon: Phone,
    title: 'Медицина',
    description: 'Клиники, врачи, стоимость приёма и экстренная медицинская помощь.',
    linkText: 'Найти врача',
    href: '/help/medicine',
  },
  {
    icon: FileText,
    title: 'Документы',
    description: 'Виза, страховка, потерянные документы и важные контакты посольств.',
    linkText: 'Узнать подробнее',
    href: '/help/documents',
  },
  {
    icon: Shield,
    title: 'Безопасность',
    description: 'Экстренные службы, безопасные районы и как избежать проблем.',
    linkText: 'Читать о безопасности',
    href: '/help/safety',
  },
  {
    icon: HelpCircle,
    title: 'Ещё помощь',
    description: 'Другие полезные сервисы и ответы на частые вопросы туристов.',
    linkText: 'Смотреть всё',
    href: '/help/all',
  },
]

export default function UrgentCardsBlock({
  className = '',
  containerClass = '',
  cards = defaultCards,
}: UrgentCardsBlockProps) {
  return (
    <section
      className={cn(
        'relative',
        containerClass,
        className,
      )}
    >
      {/* Заголовок секции */}
      <h2 className="text-3xl font-bold text-[#0A5D56] mb-8">
        Срочно нужно
      </h2>

      {/* Сетка карточек */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const IconComponent = card.icon
          return (
            <div
              key={card.title}
              className="
                group
                bg-white 
                rounded-2xl 
                p-6 
                shadow-sm 
                hover:shadow-lg 
                transition-all 
                duration-300 
                hover:-translate-y-1
                border border-transparent
                hover:border-[#0A5D56]/10
              "
            >
              {/* Иконка */}
              <div className="w-12 h-12 rounded-xl bg-[#0A5D56]/10 flex items-center justify-center mb-4 group-hover:bg-[#0A5D56]/20 transition-colors duration-300">
                <IconComponent 
                  size={22} 
                  className="text-[#0A5D56]" 
                />
              </div>

              {/* Заголовок */}
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                {card.title}
              </h3>

              {/* Описание */}
              <p className="text-sm text-[#6B7280] mb-6 line-clamp-2">
                {card.description}
              </p>

              {/* Разделитель */}
              <div className="border-t border-[#E5E7EB] pt-4">
                <Link
                  href={card.href}
                  className="
                    inline-flex 
                    items-center 
                    gap-2 
                    text-sm 
                    font-medium 
                    text-[#0A5D56] 
                    hover:text-[#0A5D56]/80 
                    transition-colors 
                    duration-300
                  "
                >
                  {card.linkText}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
