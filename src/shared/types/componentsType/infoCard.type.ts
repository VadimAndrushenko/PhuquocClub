import { LucideIcon } from 'lucide-react'
import { PayloadMedia } from '../global.type'

// ==============================

// CollectionsCardAccent TYPES

//==============================

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

// CollectionsCardAccent TYPES

//==============================

export interface CollectionsCardData {
  id?: string | number
  href: string
  category?: string
  image: {
    url: string
    alt?: string
  }
  title: string
  description: string
  number?: string | number
}

export interface CollectionsCardProps {
  data: CollectionsCardData[]
  bg?: string
  heightInPx: number
}

// ==============================

// CollectionsCardAccent TYPES

//==============================

export interface CollectionsCardAccentData {
  href: string
  category: string
  image: PayloadMedia
  title: string
  description: string
  readTime?: string
}

export interface CollectionsCardAccentProps {
  data: CollectionsCardAccentData[]
  className?: string
}
