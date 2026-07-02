import type { CollectionsPage } from '@/payload-types'
import type { AppMedia, BestArticleMinimal } from '@/shared/types'
import type { HeroData } from '@/shared/types/blockType/hero.type'

export interface TransformedCollectionsPageData {
  heroData: HeroData
  bestCollectionData: BestArticleMinimal[]
  continuePlanning: BestArticleMinimal[]
}

interface EnrichedCollectionsPage extends CollectionsPage {
  _bestSelectionData?: BestArticleMinimal[]
  _continuePlanningData?: BestArticleMinimal[]
}

interface EnrichedBestSelection {
  bestArticles: BestArticleMinimal[]
}

interface EnrichedContinueSelection {
  continuePlanning: BestArticleMinimal[]
}

export function transformCollectionsPage(page: EnrichedCollectionsPage): TransformedCollectionsPageData {
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

  let bestCollectionData: BestArticleMinimal[] = page?._bestSelectionData || []

  if (bestCollectionData.length === 0 && typeof page?.bestSelection === 'object' && page?.bestSelection !== null) {
    bestCollectionData = (page.bestSelection as EnrichedBestSelection).bestArticles || []
  }

  let continuePlanning: BestArticleMinimal[] = page?._continuePlanningData || []

  if (continuePlanning.length === 0 && typeof page?.continueSelection === 'object' && page?.continueSelection !== null) {
    continuePlanning = (page.continueSelection as EnrichedContinueSelection).continuePlanning || []
  }

  return {
    heroData,
    bestCollectionData,
    continuePlanning,
  }
}
