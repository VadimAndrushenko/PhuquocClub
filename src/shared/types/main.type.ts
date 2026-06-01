import { ImageType } from "./global.type"


interface SectionSearch {
  placeholder: string
  tags: boolean
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
    image: ImageType
  }
}