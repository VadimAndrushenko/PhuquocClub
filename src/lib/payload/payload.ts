import config from '@payload-config'
import { getPayload, type Where } from 'payload'
import type { Article } from '@/payload-types'
import { AppMedia } from '@/shared/types'

export const getPayloadClient = async () => {
  return await getPayload({ config })
}

// ============================================
// 📄 СТАТЬИ
// ============================================

/** Получить все опубликованные статьи */
export async function getAllArticles(): Promise<Article[]> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'Articles',
    where: {
      status: { equals: 'published' },
    } as Where,
    depth: 2,
    limit: 100,
    sort: '-createdAt',
  })

  return docs as Article[]
}

/** Получить одну статью по slug */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'Articles',
    where: {
      status: { equals: 'published' },
      slug: { equals: slug },
    } as Where,
    depth: 2,
    limit: 1,
  })

  return (docs[0] as Article) || null
}

/** Получить связанные статьи */
export async function getRelatedArticles(currentSlug: string, limit = 3): Promise<Article[]> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'Articles',
    where: {
      status: { equals: 'published' },
      slug: { not_equals: currentSlug },
    } as Where,
    depth: 2,
    limit,
  })

  return docs as Article[]
}

/**
 * Получить подборку по slug подборки
 */
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

/**
 * 🔥 Получить ВСЕ статьи подборки
 * Фильтрация: subsection (как ID в БД) = ID подборки
 */
export async function getArticlesBySubsection(subsectionSlug: string) {
  const payload = await getPayloadClient()

  // 1. Находим подборку по slug → получаем её ID
  const { docs: subsections } = await payload.find({
    collection: 'subsections',
    where: { slug: { equals: subsectionSlug } },
    limit: 1,
  })

  if (!subsections[0]) return []

  const subsectionId = subsections[0].id

  // 2. Ищем ВСЕ статьи этой подборки по ID
  const { docs } = await payload.find({
    collection: 'Articles',
    where: {
      subsection: { equals: subsectionId },
      status: { equals: 'published' },
    },
    depth: 2,
    limit: 1000,
    sort: '-createdAt',
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
      href: article.href || '/',
      category: article.category || '',
      image: {
        url: imageUrl,
        alt: imageAlt,
      } as AppMedia,
      title: article.title || '',
      description: article.description || '',
      readTime: article.readTime || undefined,
    }
  })
}

/**
 * Все опубликованные подборки (для generateStaticParams)
 */
export async function getAllSubsections() {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'subsections',
    where: { status: { equals: 'published' } },
    depth: 1,
    limit: 1000,
  })

  return docs
}

/**
 * 🔥 ВСЕ опубликованные подборки в виде карточек (для страницы «Подборки»)
 */
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

// ============================================
// 🏠 GLOBAL: HOME PAGE
// ============================================

/**
 * Вспомогательная: извлечь минимальные данные из статей
 */
async function extractMinimalArticles(articleRefs: any[], payload: any) {
  const articles: any[] = []

  for (const ref of articleRefs) {
    try {
      const id = typeof ref === 'object' && ref !== null ? ref.id || ref.value : ref
      if (!id) continue

      const article = await payload.findByID({
        collection: 'Articles',
        id,
        depth: 1, // 🔥 depth: 1 чтобы подтянулось изображение
      })

      if (!article) continue

      const img = article.image as any
      // 🔥 Исправлено: берём url напрямую из image объекта
      const imageUrl = img?.url || img?.thumbnailURL || null
      const imageAlt = img?.alt || article.title || ''

      articles.push({
        id: article.id,
        title: article.title || null,
        href: article.href || '/',
        image: imageUrl ? { url: imageUrl, alt: imageAlt } : null,
        status: article.status || 'published',
        description: article.description || '',
        category: article.category || undefined,
        readTime: article.readTime || undefined,
      })
    } catch (error) {
      console.error('❌ Ошибка извлечения статьи:', error)
    }
  }

  return articles
}

/**
 * Вспомогательная: извлечь минимальные данные из subsections
 */
async function extractMinimalSubsections(subsectionRefs: any[], payload: any) {
  const collections: any[] = []

  for (let index = 0; index < subsectionRefs.length; index++) {
    try {
      const ref = subsectionRefs[index]
      const id = typeof ref === 'object' && ref !== null ? ref.id || ref.value : ref
      if (!id) continue

      const subsection = await payload.findByID({
        collection: 'subsections',
        id,
        depth: 1, // 🔥 depth: 1 чтобы подтянулось изображение
      })

      if (!subsection) continue

      const img = subsection.image as any
      const imageUrl = img?.url || img?.thumbnailURL || null
      const imageAlt = img?.alt || subsection.title || ''

      const sectionSlug =
        typeof subsection.section === 'object' && subsection.section !== null
          ? (subsection.section as any).slug || ''
          : String(subsection.section || '')

      collections.push({
        id: subsection.id,
        href: subsection.href || `/${sectionSlug}/${subsection.slug || ''}`,
        category: subsection.category || '',
        image: imageUrl ? { url: imageUrl, alt: imageAlt } : null,
        title: subsection.title || '',
        description: subsection.description || '',
        number: index + 1,
      })
    } catch (error) {
      console.error('❌ Ошибка извлечения подборки:', error)
    }
  }

  return collections
}

/**
 * Получить настройки главной страницы (Global)
 */
export async function getHomePage() {
  const payload = await getPayloadClient()

  const data = await payload.findGlobal({
    slug: 'homePage',
    depth: 3,
  })

  // 🔥 Извлекаем данные из статей напрямую (т.к. хуки отключены)
  if (data) {
    // Popular Articles
    if (data.popularArticles && Array.isArray(data.popularArticles)) {
      ;(data as any)._popularArticlesData = await extractMinimalArticles(
        data.popularArticles,
        payload,
      )
    }

    // Planning Articles + Icons
    if (data.planningBlock?.articles && Array.isArray(data.planningBlock.articles)) {
      const articles = await extractMinimalArticles(data.planningBlock.articles, payload)
      // Добавляем иконки
      const icons = data.planningBlock.icons || []
      ;(data as any)._planningArticlesData = articles.map((article, i) => ({
        ...article,
        icon: icons[i]?.icon || 'Sun',
      }))
    }

    // Collections (Subsections)
    if (data.collections && Array.isArray(data.collections)) {
      ;(data as any)._collectionsData = await extractMinimalSubsections(data.collections, payload)
    }

    // Urgent Articles + Icons
    if (data.urgentBlock?.articles && Array.isArray(data.urgentBlock.articles)) {
      const articles = await extractMinimalArticles(data.urgentBlock.articles, payload)
      // Добавляем иконки
      const icons = data.urgentBlock.icons || []
      ;(data as any)._urgentArticlesData = articles.map((article, i) => ({
        ...article,
        icon: icons[i]?.icon || 'Sun',
      }))
    }
  }

  return data
}

// ============================================
// 📁 СЕКЦИИ
// ============================================

/**
 * Получить секцию по slug
 */
export async function getSectionBySlugs(sectionSlug: string) {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'sections',
    where: {
      slug: { equals: sectionSlug },
      status: { equals: 'published' },
    },
    depth: 3, // 🔥 Важно: нужно загрузить bestSelection и continueSelection с статьями
    limit: 1,
  })

  return docs[0]
}

/**
 * 🔥 Получить ВСЕ subsections секции
 * Фильтрация: section (как ID в БД) = ID секции
 */
export async function getSubsectionsBySection(sectionSlug: string) {
  const payload = await getPayloadClient()

  // 1. Находим секцию по slug → получаем её ID
  const { docs: sections } = await payload.find({
    collection: 'sections',
    where: { slug: { equals: sectionSlug } },
    limit: 1,
  })

  if (!sections[0]) return []

  const sectionId = sections[0].id

  // 2. Ищем ВСЕ subsections этой секции по ID
  const { docs } = await payload.find({
    collection: 'subsections',
    where: {
      section: { equals: sectionId },
      status: { equals: 'published' },
    },
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
      readTime: undefined, // у subsection нет readTime
    }
  })
}

/**
 * Все опубликованные секции (для generateStaticParams)
 */
export async function getAllSections() {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'sections',
    where: { status: { equals: 'published' } },
    depth: 1,
    limit: 1000,
  })

  return docs
}
