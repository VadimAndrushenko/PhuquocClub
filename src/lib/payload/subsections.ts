import { getPayloadClient } from './payload'

export async function getSubsectionBySlugs(subsectionSlug: string) {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'subsections',
    where: {
      slug: { equals: subsectionSlug },
      status: { equals: 'published' },
    },
    depth: 3,
    limit: 1,
  })

  return docs[0]
}

export async function getAllSubsections() {
  try {
    const payload = await getPayloadClient()

    const { docs } = await payload.find({
      collection: 'subsections',
      where: { status: { equals: 'published' } },
      depth: 1,
      limit: 1000,
    })

    return docs
  } catch (error) {
    console.error('❌ Ошибка getAllSubsections:', error)
    return []
  }
}

export async function getAllSubsectionsCards() {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'subsections',
    where: { status: { equals: 'published' } },
    depth: 2,
    limit: 1000,
    sort: '-createdAt',
  })

  return docs.map((subsection) => {
    const imageUrl =
      typeof subsection.image === 'object' && subsection.image !== null && 'url' in subsection.image
        ? subsection.image.url || '/'
        : '/'

    const imageAlt =
      typeof subsection.image === 'object' && subsection.image !== null && 'alt' in subsection.image
        ? subsection.image.alt || subsection.title
        : subsection.title

    return {
      href: subsection.href || '/',
      category: subsection.category || '',
      image: {
        url: imageUrl,
        alt: imageAlt,
      },
      title: subsection.title || '',
      description: subsection.description || '',
      readTime: undefined,
    }
  })
}
