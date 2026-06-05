import type { AppMedia, BestArticleMinimal } from '@/shared/types'
import type { HeroData } from '@/shared/types/blockType/hero.type'

export interface TransformedCollectionsPageData {
  heroData: HeroData
  bestCollectionData: BestArticleMinimal[]
  continuePlanning: BestArticleMinimal[]
}

/**
 * Трансформация Global "collectionsPage" в данные для страницы.
 * Аналог transformSection.
 */
export function transformCollectionsPage(page: any): TransformedCollectionsPageData {
  // ============================================
  // 🎯 HERO — данные страницы
  // ============================================
  const heroData: HeroData = {
    title: page?.title || 'Все подборки',
    description: page?.description || '',
    intro: '',
    category: '',
    image: page?.image as AppMedia,
    search: {
      placeholder: page?.search?.placeholder || 'Поиск по подборкам...',
      tags: page?.search?.tags || [],
    },
  }

  // ============================================
  // ⭐ BEST COLLECTION DATA — из bestSelection
  // ============================================
  let bestCollectionData: BestArticleMinimal[] = []

  if (typeof page?.bestSelection === 'object' && page?.bestSelection !== null) {
    bestCollectionData = (page.bestSelection as any).bestArticles || []
  }

  // ============================================
  // 🔗 CONTINUE PLANNING — из continueSelection
  // ============================================
  let continuePlanning: BestArticleMinimal[] = []

  if (typeof page?.continueSelection === 'object' && page?.continueSelection !== null) {
    continuePlanning = (page.continueSelection as any).continuePlanning || []
  }

  return {
    heroData,
    bestCollectionData,
    continuePlanning,
  }
}
