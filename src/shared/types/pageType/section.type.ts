import type { AppMedia, PageParams, SearchConfig } from '@/shared/types'

export interface HeroSectionProps {
  containerClass?: string
  dataSection: {
    title: string
    description: string
    intro: string
    category: string
    section: string
    search: SearchConfig
    image: AppMedia
  }
}

export interface SectionPageProps {
  params: PageParams<string>
}
