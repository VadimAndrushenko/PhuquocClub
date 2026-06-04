import type {
  AppMedia,
  PageParams,
  SearchConfig,
  Subsection,
  BestArticleMinimal,
  Article,
} from '@/shared/types'

// ============================================
// 🎯 ТИПЫ ДАННЫХ
// ============================================

/** Данные для Hero компонента подборки */
export interface HeroSubSectionData {
  title: string
  slug: string
  description: string
  intro: string
  category: string
  image: AppMedia
  search: SearchConfig
  section?: string
  subsection?: string
}

/** Результат трансформации подборки */
export interface TransformedSubsectionData {
  heroData: HeroSubSectionData
  bestCollectionData: BestArticleMinimal[]
  continuePlanning: BestArticleMinimal[]
}

// ============================================
// 🎯 ТИПЫ ДЛЯ КОМПОНЕНТОВ
// ============================================

export interface HeroSubSectionProps {
  containerClass?: string
  dataSubSection: HeroSubSectionData
}

export interface SubSectionPageProps {
  params: PageParams<string>
}
