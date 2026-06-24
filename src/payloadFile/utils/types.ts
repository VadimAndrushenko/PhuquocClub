/**
 * ============================================
 * 🔧 SHARED TYPES FOR PAYLOAD COLLECTIONS
 * ============================================
 * Centralized type definitions to avoid duplication
 */

import type { AppMedia } from '@/shared/types'

/**
 * Minimal article data for relationships
 */
export interface MinimalArticle {
  id: number | string
  title: string
  slug: string
  section?: string
  subsection?: string
  category?: string
  description?: string
  image?: AppMedia | null
  href?: string
  status: 'draft' | 'published'
  readTime?: string
}

/**
 * Minimal subsection data
 */
export interface MinimalSubsection {
  id: number | string
  title: string
  slug: string
  section?: string
  category?: string
  description?: string
  image?: AppMedia | null
  href?: string
  status: 'draft' | 'published'
}

/**
 * Selection document (BestSelections / ContinueSelections)
 */
export interface SelectionDoc {
  id?: number | string
  title?: string
  slug?: string
  status?: 'draft' | 'published'
  articles?: Array<number | string | MinimalArticle>
}