import type { LucideIcon } from 'lucide-react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type {
  AppMedia,
  // RelatedArticle,
  // UsefulLink,
  // KratkoItem,
  // ContentBlock,
  ArticlePageParams,
  PageParams,
  PayloadSEO,
} from '@/shared/types'

// ============================================
// 🎯 ТИПЫ ДАННЫХ
// ============================================


export interface PayloadKratkoItem {
  icon: 'DollarSign' | 'FileText' | 'MapPin' | 'ShieldAlert' | 'Clock' | 'User'
  label: string
  value: string
}

export interface KratkoItem {
  icon: LucideIcon
  label: string
  value: string
}

export interface ContentBlock {
  id?: string
  title: string
  description?: SerializedEditorState | null
  descriptionAfter?: SerializedEditorState | null
  contentType: 'none' | 'table' | 'warning' | 'checklist' | 'tips'
  table?: {
    headers: {
      header1: string
      header2: string
      header3: string
    }
    rows?: Array<{
      id?: string | null
      cell1: string
      cell2: string
      cell3: string
    }> | null
  } | null
  warning?: string | null
  checklist?: Array<{
    id?: string | null
    item: string
  }> | null
  tips?: string | null
}

export interface UsefulLink {
  id?: string | null
  href: string
  label: string
}

export interface RelatedArticle {
  id: number
  category: string
  title: string
  description: string
  image: AppMedia
  href: string
  readTime?: string
}


// ============================================
// 🎯 ТИПЫ ДЛЯ СЫРЫХ ДАННЫХ ИЗ PAYLOAD CMS
// ============================================

/** Полная статья из Payload */
export interface PayloadArticle {
  id: number
  status: 'draft' | 'published'
  title: string
  slug: string
  section: string
  subsection: string
  category: string
  readTime: string
  author: string
  description: string
  intro: string
  image: AppMedia
  kratko_items?: PayloadKratkoItem[]
  content_blocks?: ContentBlock[]
  related_articles?: RelatedArticle[]
  useful_links?: UsefulLink[]
  seo: PayloadSEO
  createdAt: string
  updatedAt: string
  href: string
}

/** Элемент блока "Кратко" из Payload */
export interface PayloadKratkoItem {
  icon: 'DollarSign' | 'FileText' | 'MapPin' | 'ShieldAlert' | 'Clock' | 'User'
  label: string
  value: string
}

// ============================================
// 🎯 ТИПЫ ДЛЯ ТРАНСФОРМИРОВАННЫХ ДАННЫХ
// ============================================

export type HeroArticleData = {
  slug: string
  section: string
  subsection: string
  title: string
  description: string
  intro: string
  category: string
  readTime: string
  author: string
  updatedAt?: string
  createdAt?: string
  image: AppMedia
}

/** Секция для компонента BodyArticle */
export interface SectionBlock {
  title: string
  description: SerializedEditorState | null
  descriptionAfter?: SerializedEditorState | null
  typeContent?: 'table' | 'warning' | 'checklist' | 'tips'
  table?: {
    headers: string[]
    rows: string[][]
  }
  warning?: string
  checklist?: string[]
  tips?: string
}

/** Результат трансформации статьи */
export interface TransformedArticleData {
  heroData: HeroArticleData
  kratkoItems: KratkoItem[]
  sectionBlocks: SectionBlock[]
  relatedArticles: RelatedArticle[]
  usefulLinks: UsefulLink[]
}

// ============================================
// 🎯 ТИПЫ ДЛЯ КОМПОНЕНТОВ
// ============================================

export interface HeroArticleProps {
  containerClass?: string
  dataArticle: HeroArticleData
}

export interface KratkoArticleProps {
  containerClass?: string
  items: KratkoItem[]
}

export interface NavigationArticleProps {
  containerClass?: string
  blocks: SectionBlock[]
}

export interface BodyArticleProps {
  containerClass?: string
  contentArticle: SectionBlock[]
}

export interface UsefulArticleProps {
  containerClass?: string
  links?: UsefulLink[]
}

export interface RelatedArticlesProps {
  containerClass?: string
  articles: RelatedArticle[]
  title?: string
}

export interface ArticlePageProps {
  params: PageParams<string>
}