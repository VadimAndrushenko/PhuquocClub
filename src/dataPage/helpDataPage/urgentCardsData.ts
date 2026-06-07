import { Car, Pill, Wifi, ShoppingBag, type LucideIcon } from 'lucide-react'

export interface HelpCardData {
  icon: LucideIcon
  title: string
  description: string
  linkText: string
  href: string
}

export const urgentCardsData: HelpCardData[] = [
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
]
