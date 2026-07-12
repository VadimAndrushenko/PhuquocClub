import { getPayloadClient } from './payload'
import type { Article, Subsection, Media, HomePage, CollectionsPage } from '@/payload-types'
import type { BestArticleMinimal } from '@/shared/types'
import type { CollectionCardData } from '@/shared/types/componentsType/infoCard.type'
import { withLocale } from '@/lib/locale'

function extractImage(img: number | Media | null | undefined): { url: string; alt: string } | null {
  if (!img || typeof img !== 'object') return null
  return { url: img.url || '', alt: img.alt || '' }
}

function articleToMinimal(a: Article, locale = 'ru'): BestArticleMinimal {
  return {
    id: a.id,
    title: a.title || null,
    href: withLocale(a.href || '/', locale),
    image: extractImage(a.image),
    status: a.status,
    description: a.description || '',
    category: a.category || '',
    readTime: a.readTime || undefined,
  }
}

export async function getHeader(locale = 'ru') {
  const payload = await getPayloadClient()

  const data = await payload.findGlobal({
    slug: 'header',
    depth: 2,
    locale: locale as 'ru' | 'en',
  })

  return data
}

export async function getFooter(locale = 'ru') {
  const payload = await getPayloadClient()

  const data = await payload.findGlobal({
    slug: 'footer',
    depth: 2,
    locale: locale as 'ru' | 'en',
  })

  return data
}

function flattenArticles(
  items: (number | Article)[] | null | undefined,
  locale = 'ru',
): BestArticleMinimal[] {
  if (!items) return []
  return items
    .filter((a): a is Article => typeof a === 'object' && a !== null)
    .map((a) => articleToMinimal(a, locale))
}

function flattenSubsections(
  items: (number | Subsection)[] | null | undefined,
  locale = 'ru',
): CollectionCardData[] {
  if (!items) return []
  return items
    .filter((s): s is Subsection => typeof s === 'object' && s !== null)
    .map((s, index) => {
      const img = extractImage(s.image)
      const sectionSlug =
        typeof s.section === 'object' && s.section !== null
          ? (s.section as { slug?: string }).slug || ''
          : String(s.section || '')
      return {
        id: s.id,
        href: withLocale(s.href || `/${sectionSlug}/${s.slug || ''}`, locale),
        category: s.category || '',
        image: { url: img?.url || '', alt: img?.alt || s.title || '' },
        title: s.title || '',
        description: s.description || '',
        number: index + 1,
      }
    })
}

export async function getHomePage(locale = 'ru') {
  const payload = await getPayloadClient()

  const data = await payload.findGlobal({
    slug: 'homePage',
    depth: 3,
    locale: locale as 'ru' | 'en',
  })

  const enriched = data as HomePageEnriched

  enriched._popularArticlesData = flattenArticles(data.popularArticles, locale)

  if (data.planningBlock?.items) {
    enriched._planningArticlesData = data.planningBlock.items
      .filter((item): item is { article: Article; icon: 'Sun' | 'BookType' | 'Wallet' | 'House' | 'Plane' | 'Map' | 'Waves' | 'Utensils'; id?: string | null } =>
        !!item && typeof item.article === 'object')
      .map((item) => ({
        ...articleToMinimal(item.article as Article, locale),
        icon: item.icon || 'Sun',
      }))
  }

  enriched._collectionsData = flattenSubsections(data.collections, locale)

  if (data.urgentBlock?.items) {
    enriched._urgentArticlesData = data.urgentBlock.items
      .filter((item): item is { article: Article; icon: 'Sun' | 'BookType' | 'Wallet' | 'House' | 'Plane' | 'Map' | 'Waves' | 'Utensils'; id?: string | null } =>
        !!item && typeof item.article === 'object')
      .map((item) => ({
        ...articleToMinimal(item.article as Article, locale),
        icon: item.icon || 'Sun',
      }))
  }

  return enriched
}

interface HomePageEnriched extends HomePage {
  _popularArticlesData?: BestArticleMinimal[]
  _planningArticlesData?: BestArticleMinimal[]
  _collectionsData?: CollectionCardData[]
  _urgentArticlesData?: BestArticleMinimal[]
}

export async function getCollectionsPage(locale = 'ru') {
  const payload = await getPayloadClient()

  const data = await payload.findGlobal({
    slug: 'collectionsPage',
    depth: 3,
    locale: locale as 'ru' | 'en',
  })

  const enriched = data as CollectionsPageEnriched

  const bestSelection = data.bestSelection
  if (bestSelection && typeof bestSelection === 'object' && 'bestArticles' in bestSelection) {
    const bestColl = bestSelection as { bestArticles: (number | Article)[] }
    enriched._bestSelectionData = flattenArticles(bestColl.bestArticles, locale)
  }

  const continueSel = data.continueSelection
  if (continueSel && typeof continueSel === 'object' && 'continuePlanning' in continueSel) {
    const contColl = continueSel as { continuePlanning: (number | Article)[] }
    enriched._continuePlanningData = flattenArticles(contColl.continuePlanning, locale)
  }

  return enriched
}

interface CollectionsPageEnriched extends CollectionsPage {
  _bestSelectionData?: BestArticleMinimal[]
  _continuePlanningData?: BestArticleMinimal[]
}

export async function getHelpPage(locale = 'ru') {
  const payload = await getPayloadClient()

  const data = await payload.findGlobal({
    slug: 'helpPage' as 'homePage',
    depth: 3,
    locale: locale as 'ru' | 'en',
  })

  return data
}
