import { ImageType } from "./global.type"

/** Поиск для секции */
interface SectionSearch {
  placeholder: string
  tags: boolean
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
    image: ImageType
  }
}

// =========================

export interface SectionPageProps {
  params: Promise<{
    section: string
    subSection: string
    article: string
  }>
}