import type { Subsection } from '@/payload-types'
import type { AppMedia, BestArticleMinimal } from '@/shared/types'
import type {
  TransformedSubsectionData,
  HeroSubSectionData,
} from '@/shared/types/pageType/subSection.type'

interface EnrichedBestSelection {
  bestArticles: BestArticleMinimal[]
}

interface EnrichedContinueSelection {
  continuePlanning: BestArticleMinimal[]
}

export async function transformSubsection(
  subsection: Subsection,
): Promise<TransformedSubsectionData> {
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

  let bestCollectionData: BestArticleMinimal[] = []

  if (typeof subsection.bestSelection === 'object' && subsection.bestSelection !== null) {
    bestCollectionData = (subsection.bestSelection as EnrichedBestSelection).bestArticles || []
  }

  let continuePlanning: BestArticleMinimal[] = []

  if (typeof subsection.continueSelection === 'object' && subsection.continueSelection !== null) {
    continuePlanning = (subsection.continueSelection as EnrichedContinueSelection).continuePlanning || []
  }

  return {
    heroData,
    bestCollectionData,
    continuePlanning,
  }
}
