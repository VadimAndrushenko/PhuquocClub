import { getPayloadClient } from './payload'
import type { Article, Subsection, Media, HomePage, CollectionsPage } from '@/payload-types'
import type { BestArticleMinimal } from '@/shared/types'
import type { CollectionCardData } from '@/shared/types/componentsType/infoCard.type'

function extractImage(img: number | Media | null | undefined): { url: string; alt: string } | null {
  if (!img || typeof img !== 'object') return null
  return { url: img.url || '', alt: img.alt || '' }
}

function articleToMinimal(a: Article): BestArticleMinimal {
  return {
    id: a.id,
    title: a.title || null,
    href: a.href || '/',
    image: extractImage(a.image),
    status: a.status,
    description: a.description || '',
    category: a.category || '',
    readTime: a.readTime || undefined,
  }
}

export async function getHeader() {
  const payload = await getPayloadClient()

  const data = await payload.findGlobal({
    slug: 'header',
    depth: 1,
  })

  return data
}

export async function getFooter() {
  const payload = await getPayloadClient()

  const data = await payload.findGlobal({
    slug: 'footer',
    depth: 1,
  })

  return data
}

function flattenArticles(
  items: (number | Article)[] | null | undefined,
): BestArticleMinimal[] {
  if (!items) return []
  return items
    .filter((a): a is Article => typeof a === 'object' && a !== null)
    .map(articleToMinimal)
}

function flattenSubsections(
  items: (number | Subsection)[] | null | undefined,
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
        href: s.href || `/${sectionSlug}/${s.slug || ''}`,
        category: s.category || '',
        image: { url: img?.url || '', alt: img?.alt || s.title || '' },
        title: s.title || '',
        description: s.description || '',
        number: index + 1,
      }
    })
}

export async function getHomePage() {
  const payload = await getPayloadClient()

  const data = await payload.findGlobal({
    slug: 'homePage',
    depth: 3,
  })

  const enriched = data as HomePageEnriched

  enriched._popularArticlesData = flattenArticles(data.popularArticles)

  if (data.planningBlock?.articles) {
    const articles = flattenArticles(data.planningBlock.articles)
    const icons = data.planningBlock.icons || []
    enriched._planningArticlesData = articles.map((a, i) => ({
      ...a,
      icon: icons[i]?.icon || 'Sun',
    }))
  }

  enriched._collectionsData = flattenSubsections(data.collections)

  if (data.urgentBlock?.articles) {
    const articles = flattenArticles(data.urgentBlock.articles)
    const icons = data.urgentBlock.icons || []
    enriched._urgentArticlesData = articles.map((a, i) => ({
      ...a,
      icon: icons[i]?.icon || 'Sun',
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

export async function getCollectionsPage() {
  const payload = await getPayloadClient()

  const data = await payload.findGlobal({
    slug: 'collectionsPage',
    depth: 3,
  })

  const enriched = data as CollectionsPageEnriched

  const bestSelection = data.bestSelection
  if (bestSelection && typeof bestSelection === 'object' && 'bestArticles' in bestSelection) {
    const bestColl = bestSelection as { bestArticles: (number | Article)[] }
    enriched._bestSelectionData = flattenArticles(bestColl.bestArticles)
  }

  const continueSel = data.continueSelection
  if (continueSel && typeof continueSel === 'object' && 'continuePlanning' in continueSel) {
    const contColl = continueSel as { continuePlanning: (number | Article)[] }
    enriched._continuePlanningData = flattenArticles(contColl.continuePlanning)
  }

  return enriched
}

interface CollectionsPageEnriched extends CollectionsPage {
  _bestSelectionData?: BestArticleMinimal[]
  _continuePlanningData?: BestArticleMinimal[]
}
