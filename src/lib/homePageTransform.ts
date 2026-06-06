import type { AppMedia, BestArticleMinimal, SearchConfig } from '@/shared/types'
import type { HeroMainProps } from '@/shared/types/pageType/main.type'
import type { CollectionCardData as InfoCardCollectionCardData } from '@/shared/types/componentsType/infoCard.type'

// ============================================
// 🔧 ТИПЫ
// ============================================

// 🔥 Используем тип из infoCard.type.ts для совместимости
export type CollectionCardData = InfoCardCollectionCardData

export interface TransformedHomePageData {
  heroData: HeroMainProps['dataMain']
  popularArticles: BestArticleMinimal[]
  planningArticles: BestArticleMinimal[]
  collectionsData: CollectionCardData[]
  urgentArticles: BestArticleMinimal[]
}

// ============================================
// 🔥 ТРАНСФОРМАЦИЯ
// ============================================

/**
 * Трансформация Global "homePage" в данные для главной страницы.
 * Извлекает только нужные поля из выбранных статей/подборок.
 */
export function transformHomePage(page: any): TransformedHomePageData {
  // ============================================
  // 🎯 HERO ДАННЫЕ
  // ============================================
  const heroData: HeroMainProps['dataMain'] = {
    title: page?.heroSection?.title || 'Гид по Фукуоку',
    description: page?.heroSection?.description || '',
    image: (page?.heroSection?.image as AppMedia) || { url: '', alt: '' },
    search: {
      placeholder: page?.heroSection?.search?.placeholder || 'Поиск по сайту...',
      tags: (page?.heroSection?.search?.tags || []).map((tag: any) => ({
        id: tag.id || '',
        title: tag.title || '',
        icon: tag.icon || 'map',
      })),
    },
  }

  // ============================================
  // 🔥 ПОПУЛЯРНЫЕ СТАТЬИ
  // ============================================
  const popularArticles: BestArticleMinimal[] = page?._popularArticlesData || []

  // ============================================
  // 📋 ПЛАНИРОВАНИЕ
  // ============================================
  const planningArticles: BestArticleMinimal[] =
    page?._planningArticlesData || page?.planningBlock?.articles || []

  // ============================================
  // 📚 ПОДБОРКИ (COLLECTIONS)
  // ============================================
  const collectionsData: CollectionCardData[] = page?._collectionsData || []

  // ============================================
  // ⚡ СРОЧНОЕ
  // ============================================
  const urgentArticles: BestArticleMinimal[] =
    page?._urgentArticlesData || page?.urgentBlock?.articles || []

  return {
    heroData,
    popularArticles,
    planningArticles,
    collectionsData,
    urgentArticles,
  }
}
