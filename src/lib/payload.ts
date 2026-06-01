import config from '@payload-config'
import { getPayload, type Where } from 'payload'
import type { PayloadArticle } from '@/shared/types/article.type'

export const getPayloadClient = async () => {
  return await getPayload({ config })
}

/** Получить все опубликованные статьи */
export async function getAllArticles(): Promise<PayloadArticle[]> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'articles',
    where: {
      status: { equals: 'published' },
    } as Where,
    depth: 2,
    limit: 100,
    sort: '-createdAt',
  })

  return docs as unknown as PayloadArticle[]
}

/** Получить одну статью по slug */
export async function getArticleBySlug(
  slug: string
): Promise<PayloadArticle | null> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'articles',
    where: {
      // status: { equals: 'published' },
      slug: { equals: slug },
    } as Where,
    depth: 2,
    limit: 1,
  })

  return (docs[0] as unknown as PayloadArticle) || null
}

/** Получить связанные статьи */
export async function getRelatedArticles(
  currentSlug: string,
  limit = 3
): Promise<PayloadArticle[]> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'articles',
    where: {
      status: { equals: 'published' },
      slug: { not_equals: currentSlug },
    } as Where,
    depth: 2,
    limit,
  })

  return docs as unknown as PayloadArticle[]
}