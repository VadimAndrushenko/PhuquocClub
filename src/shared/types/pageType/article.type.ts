import type { LucideIcon } from 'lucide-react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { AppMedia, ArticlePageParams, PageParams, PayloadSEO } from '@/shared/types'

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