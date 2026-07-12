import { getPayloadClient } from './payload'

export async function getSectionTitle(slug: string, locale = 'ru'): Promise<string> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'sections',
    where: { slug: { equals: slug } },
    select: { title: true },
    limit: 1,
    locale: locale as 'ru' | 'en',
  })
  return docs[0]?.title 
}

export async function getSubsectionTitle(slug: string, locale = 'ru'): Promise<string> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'subsections',
    where: { slug: { equals: slug } },
    select: { title: true },
    limit: 1,
    locale: locale as 'ru' | 'en',
  })
  return docs[0]?.title 
}

export async function getArticleTitle(slug: string, locale = 'ru'): Promise<string> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'Articles',
    where: { slug: { equals: slug } },
    select: { title: true },
    limit: 1,
    locale: locale as 'ru' | 'en',
  })
  return docs[0]?.title 
}