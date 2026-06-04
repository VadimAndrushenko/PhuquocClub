import type { Section, AppMedia, BestArticleMinimal } from '@/shared/types'
import type { HeroData } from '@/shared/types/blockType/hero.type'

export interface TransformedSectionData {
  heroData: HeroData
  bestCollectionData: BestArticleMinimal[]
  continuePlanning: BestArticleMinimal[]
}

export async function transformSection(section: Section): Promise<TransformedSectionData> {
  // ============================================
  // 🎯 HERO — данные секции
  // ============================================
  const heroData: HeroData = {
    title: section.title || '',
    description: section.description || '',
    intro: '', // у секции нет intro, только у subsection
    category: section.title || '',
    image: section.image as unknown as AppMedia,
    search: {
      placeholder: section.search?.placeholder || 'Поиск по разделу...',
      tags: section.search?.tags || [],
    },
    section: section.slug,
  }

  // ============================================
  // ⭐ BEST COLLECTION DATA — из bestSelection
  // ============================================
  let bestCollectionData: BestArticleMinimal[] = []

  if (typeof section.bestSelection === 'object' && section.bestSelection !== null) {
    bestCollectionData = (section.bestSelection as any).bestArticles || []
  }

  // ============================================
  // 🔗 CONTINUE PLANNING — из continueSelection
  // ============================================
  let continuePlanning: BestArticleMinimal[] = []

  if (typeof section.continueSelection === 'object' && section.continueSelection !== null) {
    continuePlanning = (section.continueSelection as any).continuePlanning || []
  }

  return {
    heroData,
    bestCollectionData,
    continuePlanning,
  }
}
