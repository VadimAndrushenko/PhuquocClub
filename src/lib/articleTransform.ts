import {
  DollarSign,
  MapPin,
  FileText,
  ShieldAlert,
  Clock,
  User,
  type LucideIcon,
} from 'lucide-react'

import type {
  PayloadArticle,
  TransformedArticleData,
  KratkoItem,
  SectionBlock,
  RelatedArticle,
  UsefulLink,
  PayloadKratkoItem,
  PayloadContentBlock,
  PayloadRelatedArticle,
  PayloadUsefulLink,
  HeroArticleData,
} from '@/shared/types/pageType/article.type'

const iconMap: Record<string, LucideIcon> = {
  DollarSign,
  FileText,
  MapPin,
  ShieldAlert,
  Clock,
  User,
}

export function transformArticle(article: PayloadArticle): TransformedArticleData {
  // ============================================
  // 🎯 ДАННЫЕ ДЛЯ HERO КОМПОНЕНТА
  // ============================================

  // Формируем объект для Hero
  const heroData: HeroArticleData = {
    title: article.title || 'Заголовок пуст',
    description: article.description || 'пуст',
    intro: article.intro || 'пуст',
    category: article.category,
    image: {
      url: article.image.url,
      alt: article.image.alt || article.title,
    },
    readTime: article.readTime || '',
    author: article.author || 'Phuquoc.Club',
    updatedAt: article.updatedAt,
    createdAt: article.createdAt,
    section: article.section,
    subsection: article.subsection,
    slug: article.slug,
  }

  // ============================================
  // 📋 БЛОК "КРАТКО"
  // ============================================
  const kratkoItems: KratkoItem[] = (article.kratko_items || []).map((item: PayloadKratkoItem) => ({
    icon: iconMap[item.icon] || FileText,
    label: item.label,
    value: item.value,
  }))

  // ============================================
  // 🧱 СЕКЦИИ СТАТЬИ
  // ============================================
  const sectionBlocks: SectionBlock[] = (article.content_blocks || []).map(
    (block: PayloadContentBlock) => {
      const result: SectionBlock = {
        title: block.title,
        description: block.description,
        typeContent: block.contentType === 'none' ? undefined : block.contentType,
      }

      if (block.contentType === 'table' && block.table) {
        const { headers, rows } = block.table
        result.table = {
          headers: [headers.header1, headers.header2, headers.header3].filter(Boolean) as string[],
          rows: rows?.map((r) => [r.cell1, r.cell2, r.cell3]) || [],
        }
      } else if (block.contentType === 'warning') {
        result.warning = block.warning
      } else if (block.contentType === 'checklist') {
        result.checklist = block.checklist?.map((c) => c.item) || []
      } else if (block.contentType === 'tips') {
        result.tips = block.tips
      }

      return result
    },
  )

  // ============================================
  // 📚 ПОЛЕЗНЫЕ ССЫЛКИ
  // ============================================
  const usefulLinks: UsefulLink[] = (article.useful_links || []).map((link: PayloadUsefulLink) => ({
    href: link.href,
    label: link.label,
  }))

  // ============================================
  // 🔗 СВЯЗАННЫЕ СТАТЬИ
  // ============================================
  const relatedArticles: RelatedArticle[] = article.related_articles || []

  return {
    heroData,
    kratkoItems,
    sectionBlocks,
    relatedArticles,
    usefulLinks,
  }
}
