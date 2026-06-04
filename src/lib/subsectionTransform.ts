import { getPayloadClient } from './payload/payload'
import type { Subsection, AppMedia, BestArticleMinimal } from '@/shared/types'
import type {
  TransformedSubsectionData,
  HeroSubSectionData,
} from '@/shared/types/pageType/subSection.type'

export async function transformSubsection(
  subsection: Subsection,
): Promise<TransformedSubsectionData> {
  // ============================================
  // 🎯 HERO — такой же формат как у статьи
  // ============================================
  const sectionSlug =
    typeof subsection.section === 'object'
      ? subsection.section.slug
      : String(subsection.section || '')

  const heroData: HeroSubSectionData = {
    title: subsection.title || '',
    description: subsection.description || '',
    intro: subsection.intro || '',
    category: subsection.category || '',
    image: subsection.image as AppMedia,
    search: {
      placeholder: subsection.search?.placeholder || 'Поиск...',
      tags: subsection.search?.tags || [],
    },
    section: sectionSlug,
    subsection: subsection.slug,
    slug: '',
  }

  // ============================================
  // ⭐ BEST COLLECTION DATA
  // ============================================
  let bestCollectionData: BestArticleMinimal[] = []

  if (typeof subsection.bestSelection === 'object' && subsection.bestSelection !== null) {
    bestCollectionData = (subsection.bestSelection as any).bestArticles || []
  }

  // ============================================
  // 🔗 CONTINUE PLANNING — из continueSelection
  // ============================================
  let continuePlanning: BestArticleMinimal[] = []

  if (typeof subsection.continueSelection === 'object' && subsection.continueSelection !== null) {
    continuePlanning = (subsection.continueSelection as any).continuePlanning || []
  }

  return {
    heroData,
    bestCollectionData,
    continuePlanning,
  }
}
