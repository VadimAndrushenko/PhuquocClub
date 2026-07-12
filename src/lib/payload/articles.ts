import type { Where } from 'payload'
import type { Article } from '@/payload-types'
import { getPayloadClient } from './payload'
import { withLocale } from '@/lib/locale'

export async function getAllArticles(locale = 'ru'): Promise<Article[]> {
  try {
    const payload = await getPayloadClient()

    const { docs } = await payload.find({
      collection: 'Articles',
      where: {
        status: { equals: 'published' },
      } as Where,
      depth: 2,
      limit: 100,
      sort: '-createdAt',
      locale: locale as 'ru' | 'en',
    })

    return docs as Article[]
  } catch (error) {
    console.error('❌ Ошибка getAllArticles:', error)
    return []
  }
}

export async function getArticleBySlug(slug: string, locale = 'ru'): Promise<Article | null> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'Articles',
    where: {
      status: { equals: 'published' },
      slug: { equals: slug },
    } as Where,
    depth: 2,
    limit: 1,
    locale: locale as 'ru' | 'en',
  })

  return (docs[0] as Article) || null
}

export async function getRelatedArticles(currentSlug: string, locale = 'ru', limit = 3): Promise<Article[]> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'Articles',
    where: {
      status: { equals: 'published' },
      slug: { not_equals: currentSlug },
    } as Where,
    depth: 2,
    limit,
    locale: locale as 'ru' | 'en',
  })

  return docs as Article[]
}

export async function getArticlesBySubsection(subsectionSlug: string, locale = 'ru') {
  const payload = await getPayloadClient()

  const { docs: subsections } = await payload.find({
    collection: 'subsections',
    where: { slug: { equals: subsectionSlug } },
    limit: 1,
  })

  if (!subsections[0]) return []

  const subsectionId = subsections[0].id

  const { docs } = await payload.find({
    collection: 'Articles',
    where: {
      subsection: { equals: subsectionId },
      status: { equals: 'published' },
    },
    depth: 2,
    limit: 1000,
    sort: '-createdAt',
    locale: locale as 'ru' | 'en',
  })

  return docs.map((article) => {
    const imageUrl =
      typeof article.image === 'object' && article.image !== null && 'url' in article.image
        ? article.image.url || '/'
        : '/'

    const imageAlt =
      typeof article.image === 'object' && article.image !== null && 'alt' in article.image
        ? article.image.alt || article.title
        : article.title

    return {
      href: withLocale(article.href || '/', locale),
      category: article.category || '',
      image: {
        url: imageUrl,
        alt: imageAlt,
      },
      title: article.title || '',
      description: article.description || '',
      readTime: article.readTime || undefined,
    }
  })
}
