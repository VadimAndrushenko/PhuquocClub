import type { LucideIcon } from 'lucide-react'
import type { AppMedia } from '@/shared/types'

// ==============================
// TripPlanning TYPES
// ==============================

export interface TripPlanningProps {
  arr: {
    icon: LucideIcon
    title: string
    description: string
    href: string
    titleLink?: string
  }[]
}

// ==============================
// CollectionsCard TYPES
// ==============================

export interface CollectionCardData {
  href: string
  category?: string
  image: AppMedia
  title: string
  description: string
  number?: number
  id?: number | string
}

export interface CollectionsCardProps {
  data: CollectionCardData[]
  bg?: string
  heightInPx: number
}

// ==============================
// CollectionsCardAccent TYPES
// ==============================

export interface CollectionsCardAccentData {
  href: string
  category: string
  image: AppMedia
  title: string
  description: string
  readTime?: string
}

export interface CollectionsCardAccentProps {
  data: CollectionsCardAccentData[]
  className?: string
}
