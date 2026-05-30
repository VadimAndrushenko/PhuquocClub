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
} from '@/shared/types/article.type'

const iconMap: Record<string, LucideIcon> = {
  DollarSign,
  FileText,
  MapPin,
  ShieldAlert,
  Clock,
  User,
}

export function transformArticle(article: PayloadArticle): TransformedArticleData {
  // 1. 🎯 Блок "Кратко" — используем PayloadKratkoItem
  const kratkoItems: KratkoItem[] = (article.kratko_items || []).map(
    (item: PayloadKratkoItem) => ({
      icon: iconMap[item.icon] || FileText,
      label: item.label,
      value: item.value,
    })
  )
  
  // 2. 🧱 Секции статьи — используем PayloadContentBlock
  const sectionBlocks: SectionBlock[] = (article.content_blocks || [])
    .map((block: PayloadContentBlock) => {
      const result: SectionBlock = {
        title: block.title,
        description: block.description,
        typeContent: block.contentType === 'none' ? undefined : block.contentType,
      }

      // 📊 Таблица
      if (block.contentType === 'table' && block.table) {
        const { headers, rows } = block.table
        result.table = {
          headers: [headers.header1, headers.header2, headers.header3].filter(
            Boolean
          ) as string[],
          rows: rows?.map((r) => [r.cell1, r.cell2, r.cell3]) || [],
        }
      }
      // ⚠️ Предупреждение
      else if (block.contentType === 'warning') {
        result.warning = block.warning
      }
      // ✅ Чек-лист
      else if (block.contentType === 'checklist') {
        result.checklist = block.checklist?.map((c) => c.item) || []
      }
      // 💡 Совет
      else if (block.contentType === 'tips') {
        result.tips = block.tips
      }

      return result
    })

  // 3. 📚 Полезные ссылки — используем PayloadUsefulLink
  const usefulLinks: UsefulLink[] = (article.useful_links || []).map(
    (link: PayloadUsefulLink) => ({
      href: link.href,
      label: link.label,
    })
  )

  // 4. 🔗 Связанные статьи — используем PayloadRelatedArticle
  const relatedArticles: RelatedArticle[] = (article.related_articles || []).map(
    (a: PayloadRelatedArticle) => ({
      id: a.id || '',
      category: a.category || '',
      title: a.title,
      description: a.description || '',
      image: a.image || '/collection.png',
      href: a.href,
      readTime: a.readTime,
    })
  )


  return {
    article,
    kratkoItems,
    sectionBlocks,
    relatedArticles,
    usefulLinks,
  }
}