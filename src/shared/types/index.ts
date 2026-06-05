/**
 * ============================================
 * 📦 ОБЩИЕ ТИПЫ ПРОЕКТА
 * ============================================
 * Только типы которые используются в НЕСКОЛЬКИХ местах
 */

import type { LucideIcon } from 'lucide-react'

// ============================================
// 🔧 ТИПЫ ИЗ PAYLOAD CMS (автоматически генерируются)
// ============================================
export type { Article, Media, Subsection, Section, User, BestSelection } from '@/payload-types'

// ============================================
// 📄 КАСТОМНЫЕ ТИПЫ (ручное определение)
// ============================================
/**
 * Минимальные данные статьи для отображения в админке
 * Используется в хуках для избежания рекурсивных запросов
 */
export interface BestArticleMinimal {
  id: number | string
  title: string | null
  href: string
  image: { url: string; alt: string } | null
  status: 'draft' | 'published'
  description: string
  category?: string
  readTime?: string
  icon?: string // 🔥 Для Planning и Urgent блоков
}

// ============================================
// 🎯 ПАРАМЕТРЫ СТРАНИЦ (Next.js)
// ============================================

export type PageParams<T extends string = string> = Promise<{ [key: string]: T }>

export interface SectionPageParams {
  section: string
}

export interface SubSectionPageParams {
  section: string
  subSection: string
}

export interface ArticlePageParams {
  section: string
  subSection: string
  article: string
}

// ============================================
// 🖼️ МЕДИА
// ============================================

export interface AppMedia {
  id?: number
  url?: string | null
  thumbnailURL?: string | null
  filename?: string | null
  mimeType?: string | null
  width?: number | null
  height?: number | null
  alt?: string | null
}

// ============================================
// 🔍 ПОИСК
// ============================================
export type SearchIconType =
  | 'utensilsCrossed'
  | 'map'
  | 'waves'
  | 'bus'
  | 'dollarSign'
  | 'fileText'
  | 'lifeBuoy'

export interface SearchTag {
  id?: string | number | null
  title: string
  icon: SearchIconType
}

export interface SearchConfig {
  placeholder?: string
  tags?: SearchTag[]
}

// ============================================
// SEO
// ============================================

export interface PayloadSEO {
  title: string
  description: string
  keywords?: Array<{ id?: string | null; keyword: string }>
  noIndex?: boolean | null
}
