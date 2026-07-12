import {
  Car,
  Pill,
  Wifi,
  ShoppingBag,
  Phone,
  FileText,
  Shield,
  HelpCircle,
  Stethoscope,
  WifiOff,
  Plane,
  Wallet,
  Map,
  UtensilsCrossed,
  Waves,
  Bus,
  DollarSign,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react'

import type { HeroData } from '@/shared/types/blockType/hero.type'
import { withLocale } from '@/lib/locale'

export interface HelpCardData {
  icon: LucideIcon
  label: string
  description: string
  linkLabel: string
  href: string
}

export interface FaqItemData {
  question: string
  answer: string
}

export interface ChecklistItemData {
  text: string
  type: 'positive' | 'warning'
}

export interface CheckListBlockData {
  title: string
  badge: string
  positiveTitle: string
  warningTitle: string
  items: ChecklistItemData[]
}

export interface TransformedHelpPageData {
  heroData: HeroData
  urgentSection: { title: string; cards: HelpCardData[] }
  whatHappenedSection: { title: string; cards: HelpCardData[] }
  faqSection: { title: string; items: FaqItemData[] }
  cardBlock1: { title: string; cards: HelpCardData[] }
  cardBlock2: CheckListBlockData
}

const iconMap: Record<string, LucideIcon> = {
  Car,
  Pill,
  Wifi,
  ShoppingBag,
  Phone,
  FileText,
  Shield,
  HelpCircle,
  Stethoscope,
  WifiOff,
  Plane,
  Wallet,
  Map,
}

const searchIconMap: Record<string, LucideIcon> = {
  utensilsCrossed: UtensilsCrossed,
  map: Map,
  waves: Waves,
  bus: Bus,
  dollarSign: DollarSign,
  fileText: FileText,
  lifeBuoy: LifeBuoy,
}

function resolveLink(link: any, locale: string): string {
  if (!link) return '/'
  const { linkType, section, subsection, article, externalUrl } = link
  switch (linkType) {
    case 'external':
      return externalUrl || '/'
    case 'section': {
      const s = section as any
      return s?.slug ? withLocale(`/${s.slug}`, locale) : '/'
    }
    case 'subsection': {
      const sub = subsection as any
      if (sub) {
        const sectionSlug =
          typeof sub.section === 'object' && sub.section
            ? (sub.section as any).slug || ''
            : ''
        const subSlug = sub.slug
        if (sectionSlug && subSlug) {
          return withLocale(`/${sectionSlug}/${subSlug}`, locale)
        }
      }
      return '/'
    }
    case 'article': {
      const art = article as any
      if (art) {
        const sectionSlug = art.section
        const subField = art.subsection
        const subsectionSlug =
          typeof subField === 'object' && subField ? (subField as any).slug || '' : ''
        const artSlug = art.slug
        if (sectionSlug && subsectionSlug && artSlug) {
          return withLocale(`/${sectionSlug}/${subsectionSlug}/${artSlug}`, locale)
        }
        return withLocale(art.href || `/${artSlug || ''}`, locale)
      }
      return '/'
    }
    default:
      return '/'
  }
}

function mapCard(card: any, locale: string): HelpCardData {
  if (!card) return { icon: HelpCircle, label: '', description: '', linkLabel: '', href: '/' }
  const Icon = iconMap[card.icon] || HelpCircle
  return {
    icon: Icon,
    label: card.label || '',
    description: card.description || '',
    linkLabel: card.link?.label || (locale === 'en' ? 'Read more' : 'Подробнее'),
    href: resolveLink(card.link, locale),
  }
}

export function transformHelpPage(page: any, locale = 'ru'): TransformedHelpPageData {
  const hero = page.hero
  const heroData: HeroData = {
    category: locale === 'en' ? 'Tourist Help' : 'Помощь туристу',
    title: hero?.title || (locale === 'en' ? 'Help in Phu Quoc' : 'Помощь на Фукуоке'),
    description: hero?.description || '',
    intro: hero?.intro || '',
    noImage: true,
    search: {
      placeholder: hero?.searchPlaceholder || (locale === 'en' ? 'What to find: taxi, pharmacy...' : 'Что найти: такси, аптека...'),
      tags: (hero?.searchTags || []).map((tag: any) => ({
        id: tag.id || '',
        title: tag.title || '',
        icon: tag.icon || 'lifeBuoy',
      })),
    },
  }

  const urgentSection = {
    title: page.urgentSection?.title || (locale === 'en' ? 'Urgently needed' : 'Срочно нужно'),
    cards: (page.urgentSection?.cards || []).map((card: any) => mapCard(card, locale)),
  }

  const whatHappenedSection = {
    title: page.whatHappenedSection?.title || (locale === 'en' ? 'What happened?' : 'Что случилось?'),
    cards: (page.whatHappenedSection?.cards || []).map((card: any) => mapCard(card, locale)),
  }

  const faqSection = {
    title: page.faqSection?.title || (locale === 'en' ? 'Popular questions' : 'Популярные вопросы'),
    items: (page.faqSection?.items || []).map((item: any) => ({
      question: item.question || '',
      answer: item.answer || '',
    })),
  }

  const cardBlock1 = {
    title: page.cardBlock1?.title || '',
    cards: (page.cardBlock1?.cards || []).map((card: any) => mapCard(card, locale)),
  }

  const cardBlock2: CheckListBlockData = {
    title: page.cardBlock2?.title || '',
    badge: (page.cardBlock2 as any)?.badge || '',
    positiveTitle: (page.cardBlock2 as any)?.positiveTitle || '',
    warningTitle: (page.cardBlock2 as any)?.warningTitle || '',
    items: (page.cardBlock2?.items || []).map((item: any) => ({
      text: item.text || '',
      type: (item.type === 'warning' ? 'warning' : 'positive') as 'positive' | 'warning',
    })),
  }

  return {
    heroData,
    urgentSection,
    whatHappenedSection,
    faqSection,
    cardBlock1,
    cardBlock2,
  }
}
