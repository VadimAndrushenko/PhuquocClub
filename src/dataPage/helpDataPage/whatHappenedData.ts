import { FileText, Stethoscope, WifiOff, Plane, Wallet, Map, type LucideIcon } from 'lucide-react'

export interface WhatHappenedCardData {
  icon: LucideIcon
  title: string
  description: string
  linkText: string
  href: string
}

export const whatHappenedData: WhatHappenedCardData[] = [
  {
    icon: FileText,
    title: 'Потеряли документы',
    description: 'Что проверить, где искать копии и куда обращаться дальше.',
    linkText: 'Что делать',
    href: '/help/documents-lost',
  },
  {
    icon: Stethoscope,
    title: 'Нужен врач',
    description: 'Как найти клинику, аптеку или помощь рядом.',
    linkText: 'Что делать',
    href: '/help/doctor',
  },
  {
    icon: WifiOff,
    title: 'Нет интернета',
    description: 'Где купить SIM, как подключить eSIM и что проверить в телефоне.',
    linkText: 'Что делать',
    href: '/help/no-internet',
  },
  {
    icon: Plane,
    title: 'Не можете уехать',
    description: 'Такси, трансфер, байк, аренда авто и варианты маршрута.',
    linkText: 'Что делать',
    href: '/help/cant-leave',
  },
  {
    icon: Wallet,
    title: 'Нужно обменять деньги',
    description: 'Где менять, как сравнить курс и на что обратить внимание.',
    linkText: 'Что делать',
    href: '/help/exchange',
  },
  {
    icon: Map,
    title: 'Нужен совет по району',
    description: 'Где жить, куда поехать, где поесть и какие пляжи выбрать.',
    linkText: 'Что делать',
    href: '/help/districts',
  },
]
