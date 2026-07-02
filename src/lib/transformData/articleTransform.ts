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
  UsefulLink,
  RelatedArticle,
} from '@/shared/types/pageType/article.type'
import type { AppMedia } from '@/shared/types'

const iconMap: Record<string, LucideIcon> = {
  DollarSign,
  FileText,
  MapPin,
  ShieldAlert,
  Clock,
  User,
}

function resolveMedia(image: Article['image']): AppMedia {
  if (typeof image === 'object' && image !== null) {
    return image as unknown as AppMedia
  }
  return {}
}

function isFullArticle(item: number | Article): item is Article {
  return typeof item === 'object' && item !== null
}

export function transformArticle(article: Article): TransformedArticleData {
  const heroData: HeroArticleData = {
    title: article.title || 'Заголовок пуст',
    description: article.description || 'пуст',
    intro: article.intro || 'пуст',
    category: article.category || '',
    image: resolveMedia(article.image),
    readTime: article.readTime || '',
    author: article.author || 'Phuquoc.Club',
    updatedAt: article.updatedAt,
    createdAt: article.createdAt,
    section: article.section || '',
    subsection: typeof article.subsection === 'string' ? article.subsection : '',
    slug: article.slug || '',
  }

  const kratkoItems: KratkoItem[] = (article.kratko_items || []).map((item) => ({
    icon: iconMap[item.icon] || FileText,
    label: item.label,
    value: item.value,
  }))

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

  const usefulLinks: UsefulLink[] = (article.useful_links || []).map((link) => ({
    href: (link as { href?: string }).href || '',
    label: link.label,
  }))

  const relatedArticles: RelatedArticle[] = (article.related_articles || [])
    .filter(isFullArticle)
    .map((item) => ({
      id: item.id,
      category: item.category || '',
      title: item.title || '',
      description: item.description || '',
      image: resolveMedia(item.image),
      href: item.href || '',
      readTime: item.readTime || undefined,
    }))

  return {
    heroData,
    kratkoItems,
    sectionBlocks,
    relatedArticles,
    usefulLinks,
  }
}
