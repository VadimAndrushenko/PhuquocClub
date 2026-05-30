import type { LucideIcon } from 'lucide-react'

// ============================================
// 🎯 ТИПЫ ДЛЯ СЫРЫХ ДАННЫХ ИЗ PAYLOAD CMS
// ============================================

/** Изображение из коллекции media */
export interface PayloadMedia {
  id: string | number
  url: string
  filename: string
  mimeType: string
  alt?: string
  width?: number
  height?: number
}

/** Элемент блока "Кратко" */
export interface PayloadKratkoItem {
  id?: string
  icon: 'DollarSign' | 'FileText' | 'MapPin' | 'ShieldAlert' | 'Clock' | 'User'
  label: string
  value: string
}

/** Блок "Кратко" */
export interface PayloadKratko {
  items?: PayloadKratkoItem[]
}

/** Таблица в секции */
export interface PayloadTable {
  headers: {
    header1: string
    header2: string
    header3: string
  }
  rows: Array<{
    id?: string
    cell1: string
    cell2: string
    cell3: string
  }>
}

/** Чек-лист в секции */
export interface PayloadChecklist {
  id?: string
  item: string
}

/** Секция контента */
export interface PayloadSectionBlock {
  blockType: 'section'
  id?: string
  title: string
  description: string
  contentType: 'none' | 'table' | 'warning' | 'checklist' | 'tips'
  table?: PayloadTable
  warning?: string
  checklist?: PayloadChecklist[]
  tips?: string
}

/** Любой блок контента */
export type PayloadContentBlock = PayloadSectionBlock 

/** Связанная статья */
export interface PayloadRelatedArticle {
  id?: string
  category?: string
  title: string
  description?: string
  image?: string
  href: string
  readTime?: string
}

/** Полезная ссылка */
export interface PayloadUsefulLink {
  id?: string
  href: string
  label: string
}

/** SEO настройки */
export interface PayloadSEO {
  title?: string
  description?: string
  keywords?: Array<{ id?: string; keyword: string }>
  noIndex?: boolean
}

/** Полная статья из Payload */
export interface PayloadArticle {
  id: string | number
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
  image?: PayloadMedia | null
  kratko_items?: PayloadKratkoItem[]
  content_blocks?: any[]  // теперь array, не blocks
  related_articles?: PayloadRelatedArticle[]
  useful_links?: PayloadUsefulLink[]
  seo?: PayloadSEO
  createdAt: string
  updatedAt: string
}

// ============================================
// 🎯 ТИПЫ ДЛЯ ТРАНСФОРМИРОВАННЫХ ДАННЫХ
// ============================================

/** Элемент блока "Кратко" для компонента */
export interface KratkoItem {
  icon: LucideIcon
  label: string
  value: string
}

/** Данные таблицы для компонента */
export interface TableData {
  headers: string[]
  rows: string[][]
}

/** Секция для компонента BodyArticle */
export interface SectionBlock {
  title: string
  description: string
  typeContent?: 'table' | 'warning' | 'checklist' | 'tips'
  table?: TableData
  warning?: string
  checklist?: string[]
  tips?: string
}

/** Связанная статья для компонента */
export interface RelatedArticle {
  id: string | number
  category: string
  title: string
  description: string
  image: string
  href: string
  readTime?: string
}

/** Полезная ссылка для компонента */
export interface UsefulLink {
  href: string
  label: string
}

/** Результат трансформации статьи */
export interface TransformedArticleData {
  article: PayloadArticle
  kratkoItems: KratkoItem[]
  sectionBlocks: SectionBlock[]
  relatedArticles: RelatedArticle[]
  usefulLinks: UsefulLink[]
}

// ============================================
// 🎯 ТИПЫ ДЛЯ КОМПОНЕНТОВ
// ============================================

/** Props для HederArticle */
export interface HederArticleProps {
  className?: string
  article: {
    slug?: string
    section?: string
    subsection?: string
    title?: string
    description?: string
    intro?: string
    category?: string
    readTime?: string
    author?: string
    updatedAt?: string
    createdAt?: string
    image?: PayloadMedia | string | null
  }
}

/** Props для KratkoArticle */
export interface KratkoArticleProps {
  className?: string
  items: KratkoItem[]
}

/** Props для NavigationArticle */
export interface NavigationArticleProps {
  className?: string
  blocks: SectionBlock[]
}

/** Props для BodyArticle */
export interface BodyArticleProps {
  className?: string
  contentArticle: SectionBlock[]
}

/** Props для UsefulArticle */
export interface UsefulArticleProps {
  className?: string
  links?: UsefulLink[]
}

/** Props для RelatedArticles */
export interface RelatedArticlesProps {
  className?: string
  articles: RelatedArticle[]
  title?: string
}

/** Props для страницы статьи */
export interface ArticlePageProps {
  params: Promise<{
    section: string
    subSection: string
    article: string
  }>
}