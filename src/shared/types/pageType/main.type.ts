import type { AppMedia } from '@/shared/types'
import { SearchTag } from '../componentsType/serchInput.type'

interface SectionSearch {
  placeholder: string
  tags: SearchTag
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
