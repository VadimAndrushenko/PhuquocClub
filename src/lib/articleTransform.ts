import {
  DollarSign,
  MapPin,
  FileText,
  ShieldAlert,
  Clock,
  User,
  type LucideIcon,
} from 'lucide-react'

import type { Article } from '@/payload-types'
import type {
  TransformedArticleData,
  SectionBlock,
  HeroArticleData,
  KratkoItem,
  ContentBlock,
  UsefulLink,
  RelatedArticle,
} from '@/shared/types/pageType/article.type'
import { AppMedia } from '@/shared/types'


const iconMap: Record<string, LucideIcon> = {
  DollarSign,
  FileText,
  MapPin,
  ShieldAlert,
  Clock,
  User,
}

export function transformArticle(article: Article): TransformedArticleData {
  // ============================================
  // 🎯 ДАННЫЕ ДЛЯ HERO КОМПОНЕНТА
  // ============================================

  // Формируем объект для Hero
  const heroData: HeroArticleData = {
    title: article.title || 'Заголовок пуст',
    description: article.description || 'пуст',
    intro: article.intro || 'пуст',
    category: article.category || '',
    image: article.image as AppMedia,
    readTime: article.readTime || '',
    author: article.author || 'Phuquoc.Club',
    updatedAt: article.updatedAt,
    createdAt: article.createdAt,
    section: article.section || '',
    subsection: typeof article.subsection === 'string' ? article.subsection : '',
    slug: article.slug || '',
  }

  // ============================================
  // 📋 БЛОК "КРАТКО"
  // ============================================
  const kratkoItems: KratkoItem[] = (article.kratko_items || []).map((item) => ({
    icon: iconMap[item.icon] || FileText,
    label: item.label,
    value: item.value,
  }))

  // ============================================
  // 🧱 СЕКЦИИ СТАТЬИ
  // ============================================
  const sectionBlocks: SectionBlock[] = (article.content_blocks || []).map((block) => {
    const result: SectionBlock = {
      title: block.title,
      description: block.description || null,
      descriptionAfter: block.descriptionAfter || null,
      typeContent: block.contentType === 'none' ? undefined : (block.contentType as SectionBlock['typeContent']),
    }

    if (block.contentType === 'table' && block.table) {
      const { headers, rows } = block.table
      result.table = {
        headers: [headers.header1, headers.header2, headers.header3].filter(Boolean) as string[],
        rows: rows?.map((r) => [r.cell1, r.cell2, r.cell3]) || [],
      }
    } else if (block.contentType === 'warning') {
      result.warning = block.warning || undefined
    } else if (block.contentType === 'checklist') {
      result.checklist = block.checklist?.map((c) => c.item) || []
    } else if (block.contentType === 'tips') {
      result.tips = block.tips || undefined
    }

    return result
  })

  // ============================================
  // 📚 ПОЛЕЗНЫЕ ССЫЛКИ
  // ============================================
  const usefulLinks: UsefulLink[] = (article.useful_links || []).map((link) => ({
    href: link.href,
    label: link.label,
  }))

  // ============================================
  // 🔗 СВЯЗАННЫЕ СТАТЬИ
  // ============================================
  const relatedArticles: RelatedArticle[] = (article.related_articles || []).map((item) => ({
    id: typeof item === 'number' ? item : item.id,
    category:
      typeof item === 'object' && item !== null && 'category' in item ? item.category || '' : '',
    title: typeof item === 'object' && item !== null && 'title' in item ? item.title || '' : '',
    description:
      typeof item === 'object' && item !== null && 'description' in item ? item.description || '' : '',
    image:
      typeof item === 'object' && item !== null && 'image' in item
        ? (item.image as AppMedia)
        : { id: 0 },
    href: typeof item === 'object' && item !== null && 'href' in item ? item.href || '' : '',
    readTime:
      typeof item === 'object' && item !== null && 'readTime' in item ? item.readTime || '' : undefined,
  }))

  return {
    heroData,
    kratkoItems,
    sectionBlocks,
    relatedArticles,
    usefulLinks,
  }
}
