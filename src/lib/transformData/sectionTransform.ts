import type { Section } from '@/payload-types'
import type { AppMedia, BestArticleMinimal } from '@/shared/types'
import type { HeroData } from '@/shared/types/blockType/hero.type'
import { withLocale } from '@/lib/locale'

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

export async function transformSection(section: Section, locale = 'ru'): Promise<TransformedSectionData> {
  const heroData: HeroData = {
    title: section.title || '',
    description: section.description || '',
    intro: '',
    category: section.title || '',
    image: section.image as unknown as AppMedia,
    search: {
      placeholder: section.search?.placeholder || (locale === 'en' ? 'Search section...' : 'Поиск по разделу...'),
      tags: section.search?.tags || [],
    },
    section: section.slug,
  }

  let bestCollectionData: BestArticleMinimal[] = []
  if (typeof section.bestSelection === 'object' && section.bestSelection !== null) {
    bestCollectionData = ((section.bestSelection as EnrichedBestSelection).bestArticles || []).map((a) => ({
      ...a,
      href: withLocale(a.href || '', locale),
    }))
  }

  let continuePlanning: BestArticleMinimal[] = []
  if (typeof section.continueSelection === 'object' && section.continueSelection !== null) {
    continuePlanning = ((section.continueSelection as EnrichedContinueSelection).continuePlanning || []).map((a) => ({
      ...a,
      href: withLocale(a.href || '', locale),
    }))
  }

  return {
    heroData,
    bestCollectionData,
    continuePlanning,
  }
}
