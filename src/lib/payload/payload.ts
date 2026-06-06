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
    })

    return docs as Article[]
  } catch (error) {
    console.error('❌ Ошибка getAllArticles:', error)
    return [] // 🔥 Возвращаем пустой массив при ошибке БД
  }
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
    return [] // 🔥 Возвращаем пустой массив при ошибке БД
  }
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
      const imageUrl = img?.url || img?.thumbnailURL || ''
      const imageAlt = img?.alt || subsection.title || ''

      const sectionSlug =
        typeof subsection.section === 'object' && subsection.section !== null
          ? (subsection.section as any).slug || ''
          : String(subsection.section || '')

      collections.push({
        id: subsection.id,
        href: subsection.href || `/${sectionSlug}/${subsection.slug || ''}`,
        category: subsection.category || '',
        image: {
          url: imageUrl,
          alt: imageAlt,
        },
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
// 📱 GLOBAL: HEADER
// ============================================

/**
 * Получить настройки хедера (Global)
 */
export async function getHeader() {
  const payload = await getPayloadClient()

  const data = await payload.findGlobal({
    slug: 'header',
    depth: 2,
  })

  // 🔥 Извлекаем навигацию с правильными ссылками
  if (data?.navigationItems && Array.isArray(data.navigationItems)) {
    ;(data as any)._navigationItems = await extractNavigationItems(data.navigationItems, payload)
  }

  return data
}

/**
 * Вспомогательная: извлечь навигацию с ссылками
 */
async function extractNavigationItems(items: any[], payload: any) {
  const navigationItems: any[] = []

  for (const item of items) {
    try {
      const baseItem = {
        id: item.id,
        title: item.title || '',
        icon: item.icon || 'Map',
        linkType: item.linkType || 'external',
      }

      let href = '#'

      // Получаем ссылку в зависимости от типа
      if (item.linkType === 'section' && item.section) {
        const sectionId =
          typeof item.section === 'object' && item.section !== null
            ? item.section.id || item.section.value
            : item.section
        if (sectionId) {
          const section = await payload.findByID({
            collection: 'sections',
            id: sectionId,
            depth: 0,
          })
          if (section) {
            href = section.href || `/${section.slug || ''}`
          }
        }
      } else if (item.linkType === 'subsection' && item.subsection) {
        const subsectionId =
          typeof item.subsection === 'object' && item.subsection !== null
            ? item.subsection.id || item.subsection.value
            : item.subsection
        if (subsectionId) {
          const subsection = await payload.findByID({
            collection: 'subsections',
            id: subsectionId,
            depth: 1, // 🔥 depth: 1 чтобы подгрузился section
          })
          if (subsection) {
            // 🔥 Генерируем href из section.slug и subsection.slug
            const sectionSlug =
              typeof subsection.section === 'object' ? subsection.section.slug : subsection.section
            href =
              subsection.href ||
              (sectionSlug && subsection.slug
                ? `/${sectionSlug}/${subsection.slug}`
                : `/${subsection.slug || ''}`)
          }
        }
      } else if (item.linkType === 'article' && item.article) {
        const articleId =
          typeof item.article === 'object' && item.article !== null
            ? item.article.id || item.article.value
            : item.article
        if (articleId) {
          const article = await payload.findByID({
            collection: 'Articles',
            id: articleId,
            depth: 1, // 🔥 depth: 1 чтобы подгрузились section и subsection
          })
          if (article) {
            href = article.href || '/'
          }
        }
      } else if (item.linkType === 'external' && item.externalUrl) {
        href = item.externalUrl
      }

      navigationItems.push({
        ...baseItem,
        href,
      })
    } catch (error) {
      console.error('❌ Ошибка извлечения навигации:', error)
    }
  }

  return navigationItems
}

// ============================================
// 🦶 GLOBAL: FOOTER
// ============================================

/**
 * Получить настройки футера (Global)
 */
export async function getFooter() {
  const payload = await getPayloadClient()

  const data = await payload.findGlobal({
    slug: 'footer',
    depth: 2,
  })

  // 🔥 Извлекаем секции навигации
  if (data) {
    ;(data as any)._sections = [
      await extractFooterSection(data.sectionPlanning, payload),
      await extractFooterSection(data.sectionOnIsland, payload),
      await extractFooterSection(data.sectionPractice, payload),
      await extractFooterSection(data.sectionRoutes, payload),
    ].filter(Boolean)
    ;(data as any)._additionalLinks = await extractFooterAdditionalLinks(
      data.additionalLinks,
      payload,
    )
  }

  return data
}

/**
 * Вспомогательная: извлечь одну секцию футера
 */
async function extractFooterSection(sectionData: any, payload: any) {
  if (!sectionData) return null

  try {
    const result: any = {
      title: sectionData.title || 'Раздел',
      items: [],
    }

    // Извлекаем 5-6 items из секции
    for (let i = 1; i <= 6; i++) {
      const itemKey = `item${i}` as keyof typeof sectionData
      const item = sectionData[itemKey]

      if (!item || !item.label) continue

      let href = '#'

      if (item.linkType === 'section' && item.section) {
        const sectionId =
          typeof item.section === 'object' && item.section !== null
            ? item.section.id || item.section.value
            : item.section
        if (sectionId) {
          const sec = await payload.findByID({
            collection: 'sections',
            id: sectionId,
            depth: 0,
          })
          if (sec) {
            href = sec.href || `/${sec.slug || ''}`
          }
        }
      } else if (item.linkType === 'subsection' && item.subsection) {
        const subsectionId =
          typeof item.subsection === 'object' && item.subsection !== null
            ? item.subsection.id || item.subsection.value
            : item.subsection
        if (subsectionId) {
          const subsection = await payload.findByID({
            collection: 'subsections',
            id: subsectionId,
            depth: 1,
          })
          if (subsection) {
            const sectionSlug =
              typeof subsection.section === 'object' ? subsection.section.slug : subsection.section
            href =
              subsection.href ||
              (sectionSlug && subsection.slug
                ? `/${sectionSlug}/${subsection.slug}`
                : `/${subsection.slug || ''}`)
          }
        }
      } else if (item.linkType === 'article' && item.article) {
        const articleId =
          typeof item.article === 'object' && item.article !== null
            ? item.article.id || item.article.value
            : item.article
        if (articleId) {
          const article = await payload.findByID({
            collection: 'Articles',
            id: articleId,
            depth: 1,
          })
          if (article) {
            href = article.href || '/'
          }
        }
      } else if (item.linkType === 'external' && item.externalUrl) {
        href = item.externalUrl
      }

      result.items.push({ label: item.label, href })
    }

    return result.items.length > 0 ? result : null
  } catch (error) {
    console.error('❌ Ошибка извлечения секции футера:', error)
    return null
  }
}

/**
 * Вспомогательная: извлечь доп. ссылки футера
 */
async function extractFooterAdditionalLinks(linksData: any, payload: any) {
  if (!linksData) return []

  const result: any[] = []

  for (let i = 1; i <= 4; i++) {
    try {
      const linkKey = `link${i}` as keyof typeof linksData
      const link = linksData[linkKey]

      if (!link || !link.title) continue

      let href = '#'

      if (link.linkType === 'section' && link.section) {
        const sectionId =
          typeof link.section === 'object' && link.section !== null
            ? link.section.id || link.section.value
            : link.section
        if (sectionId) {
          const sec = await payload.findByID({
            collection: 'sections',
            id: sectionId,
            depth: 0,
          })
          if (sec) {
            href = sec.href || `/${sec.slug || ''}`
          }
        }
      } else if (link.linkType === 'subsection' && link.subsection) {
        const subsectionId =
          typeof link.subsection === 'object' && link.subsection !== null
            ? link.subsection.id || link.subsection.value
            : link.subsection
        if (subsectionId) {
          const subsection = await payload.findByID({
            collection: 'subsections',
            id: subsectionId,
            depth: 1,
          })
          if (subsection) {
            const sectionSlug =
              typeof subsection.section === 'object' ? subsection.section.slug : subsection.section
            href =
              subsection.href ||
              (sectionSlug && subsection.slug
                ? `/${sectionSlug}/${subsection.slug}`
                : `/${subsection.slug || ''}`)
          }
        }
      } else if (link.linkType === 'article' && link.article) {
        const articleId =
          typeof link.article === 'object' && link.article !== null
            ? link.article.id || link.article.value
            : link.article
        if (articleId) {
          const article = await payload.findByID({
            collection: 'Articles',
            id: articleId,
            depth: 1,
          })
          if (article) {
            href = article.href || '/'
          }
        }
      } else if (link.linkType === 'external' && link.externalUrl) {
        href = link.externalUrl
      }

      result.push({
        id: i,
        title: link.title,
        href,
      })
    } catch (error) {
      console.error('❌ Ошибка извлечения доп. ссылки футера:', error)
    }
  }

  return result
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
  try {
    const payload = await getPayloadClient()

    const { docs } = await payload.find({
      collection: 'sections',
      where: { status: { equals: 'published' } },
      depth: 1,
      limit: 1000,
    })

    return docs
  } catch (error) {
    console.error('❌ Ошибка getAllSections:', error)
    return [] // 🔥 Возвращаем пустой массив при ошибке БД
  }
}

// ============================================
// 📚 GLOBAL: COLLECTIONS PAGE
// ============================================

/**
 * Получить настройки страницы подборок (Global)
 */
export async function getCollectionsPage() {
  const payload = await getPayloadClient()

  const data = await payload.findGlobal({
    slug: 'collectionsPage',
    depth: 3,
  })

  // 🔥 Извлекаем данные из статей напрямую (т.к. хуки отключены)
  if (data) {
    // Best Selection
    if (data.bestSelection && Array.isArray(data.bestSelection)) {
      ;(data as any)._bestSelectionData = await extractMinimalSubsections(
        data.bestSelection,
        payload,
      )
    }

    // Continue Planning
    if (data.continueSelection && Array.isArray(data.continueSelection)) {
      ;(data as any)._continuePlanningData = await extractMinimalArticles(
        data.continueSelection,
        payload,
      )
    }
  }

  return data
}
