import type { AppMedia, SearchTag } from '@/shared/types'

interface SectionSearch {
  placeholder: string
  tags: SearchTag[]
}

export interface HeroMainProps {
  containerClass?: string
  dataMain: {
    /** Главный заголовок */
    title: string
    /** Описание под заголовком */
    description: string
    /** Настройки поиска */
    search: SectionSearch
    /** Путь к изображению */
    image: AppMedia
  }
}
