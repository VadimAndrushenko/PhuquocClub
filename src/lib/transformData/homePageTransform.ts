import type { HomePage } from '@/payload-types'
import type { AppMedia, BestArticleMinimal, SearchIconType, SearchConfig } from '@/shared/types'
import type { HeroMainProps } from '@/shared/types/pageType/main.type'
import type { CollectionCardData as InfoCardCollectionCardData } from '@/shared/types/componentsType/infoCard.type'

export type CollectionCardData = InfoCardCollectionCardData

export interface TransformedHomePageData {
  heroData: HeroMainProps['dataMain']
  popularArticles: BestArticleMinimal[]
  planningArticles: BestArticleMinimal[]
  collectionsData: CollectionCardData[]
  urgentArticles: BestArticleMinimal[]
}

interface EnrichedHomePage extends HomePage {
  _popularArticlesData?: BestArticleMinimal[]
  _planningArticlesData?: BestArticleMinimal[]
  _collectionsData?: CollectionCardData[]
  _urgentArticlesData?: BestArticleMinimal[]
}

export function transformHomePage(page: EnrichedHomePage): TransformedHomePageData {
  const heroData: HeroMainProps['dataMain'] = {
    title: page.heroSection?.title || 'Гид по Фукуоку',
    description: page.heroSection?.description || '',
    image: (page.heroSection?.image as AppMedia) || { url: '', alt: '' },
    search: {
      placeholder: page.heroSection?.search?.placeholder || 'Поиск по сайту...',
      tags: (page.heroSection?.search?.tags || []).map((tag) => ({
        id: tag.id || '',
        title: tag.title || '',
        icon: (tag.icon || 'map') as SearchIconType,
      })),
    },
  }

  const popularArticles: BestArticleMinimal[] = page._popularArticlesData || []
  const planningArticles: BestArticleMinimal[] = page._planningArticlesData || []
  const collectionsData: CollectionCardData[] = page._collectionsData || []
  const urgentArticles: BestArticleMinimal[] = page._urgentArticlesData || []

  return {
    heroData,
    popularArticles,
    planningArticles,
    collectionsData,
    urgentArticles,
  }
}
