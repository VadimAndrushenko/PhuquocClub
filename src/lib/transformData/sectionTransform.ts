import type { Section } from '@/payload-types'
import type { AppMedia, BestArticleMinimal } from '@/shared/types'
import type { HeroData } from '@/shared/types/blockType/hero.type'

export interface TransformedSectionData {
  heroData: HeroData
  bestCollectionData: BestArticleMinimal[]
  continuePlanning: BestArticleMinimal[]
}

interface EnrichedBestSelection {
  bestArticles: BestArticleMinimal[]
}

interface EnrichedContinueSelection {
  continuePlanning: BestArticleMinimal[]
}

export async function transformSection(section: Section): Promise<TransformedSectionData> {
  const heroData: HeroData = {
    title: section.title || '',
    description: section.description || '',
    intro: '',
    category: section.title || '',
    image: section.image as unknown as AppMedia,
    search: {
      placeholder: section.search?.placeholder || 'Поиск по разделу...',
      tags: section.search?.tags || [],
    },
    section: section.slug,
  }

  let bestCollectionData: BestArticleMinimal[] = []
  if (typeof section.bestSelection === 'object' && section.bestSelection !== null) {
    bestCollectionData = (section.bestSelection as EnrichedBestSelection).bestArticles || []
  }

  let continuePlanning: BestArticleMinimal[] = []
  if (typeof section.continueSelection === 'object' && section.continueSelection !== null) {
    continuePlanning = (section.continueSelection as EnrichedContinueSelection).continuePlanning || []
  }

  return {
    heroData,
    bestCollectionData,
    continuePlanning,
  }
}
