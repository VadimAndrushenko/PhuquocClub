import type { AppMedia, PageParams, SectionPageParams, SearchTag } from '@/shared/types'

/** Поиск для секции */
interface SectionSearch {
  placeholder: string
  tags: SearchTag[]
}

/** Данные для Hero на странице раздела */
export interface HeroSectionProps {
  containerClass?: string
  dataSection: {
    title: string
    description: string
    intro: string
    category: string
    section: string
    search: SectionSearch
    image: AppMedia
  }
}

// =========================

export interface SectionPageProps {
  params: PageParams<string>
}
