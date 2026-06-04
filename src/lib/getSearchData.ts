import type { SearchItem } from '@/shared/types/componentsType/serchInput.type'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || ''

// ============================================
// 🔧 ТИПЫ ОТВЕТА PAYLOAD REST API
// ============================================

interface PayloadSection {
  id: string | number
  title: string
  slug: string
  description?: string | null
}

interface PayloadSubSection {
  id: string | number
  title: string
  slug: string
  section: string | { slug: string }
  description?: string | null
  href?: string
  searchSettings?: {
    enableSearch?: boolean
    searchIcon?: string
    searchTagText?: string
  }
}

interface PayloadArticle {
  id: string | number
  title: string
  slug: string
  section: string
  subsection: string
  description?: string | null
  href?: string
}

interface PayloadResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
}

// ============================================
// 🔧 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

function buildSearchText(title: string, description?: string | null): string {
  return `${title} ${description ?? ''}`.toLowerCase()
}

// ============================================
// 🔥 ГЛАВНАЯ ФУНКЦИЯ
// ============================================

// 🔥 Глобальный кэш для данных поиска с TTL (30 секунд)
const CACHE_TTL = 30 * 1000 // 30 секунд
let searchCache: SearchItem[] | null = null
let cacheTimestamp: number | null = null
let cachePromise: Promise<SearchItem[]> | null = null

function isCacheValid(): boolean {
  if (!searchCache || !cacheTimestamp) return false
  return Date.now() - cacheTimestamp < CACHE_TTL
}

export async function getSearchData(forceRefresh = false): Promise<SearchItem[]> {
  // 🔥 Возвращаем кэш если он ещё валиден и не запрошено принудительное обновление
  if (!forceRefresh && isCacheValid()) {
    return searchCache!
  }

  // 🔥 Если уже идёт запрос — ждём его (если не forceRefresh)
  if (!forceRefresh && cachePromise) {
    return cachePromise
  }

  cachePromise = (async () => {
    try {
      const [sectionsRes, subSectionsRes, articlesRes] = await Promise.all([
        fetch(`${BASE_URL}/api/sections?where[status][equals]=published&depth=0&pagination=false`, {
          next: { revalidate: 3 },
        }),
        fetch(
          `${BASE_URL}/api/subsections?where[status][equals]=published&depth=1&pagination=false`,
          { next: { revalidate: 3 } },
        ),
        fetch(`${BASE_URL}/api/Articles?where[status][equals]=published&depth=0&pagination=false`, {
          next: { revalidate: 3 },
        }),
      ])

      if (!sectionsRes.ok || !subSectionsRes.ok || !articlesRes.ok) {
        throw new Error('Failed to fetch search data')
      }

      // 🔥 ЯВНАЯ ТИПИЗАЦИЯ — решает ошибку "never[]"
      const sectionsData = (await sectionsRes.json()) as PayloadResponse<PayloadSection>
      const subSectionsData = (await subSectionsRes.json()) as PayloadResponse<PayloadSubSection>
      const articlesData = (await articlesRes.json()) as PayloadResponse<PayloadArticle>

      const items: SearchItem[] = []

      // Sections
      const sections = sectionsData.docs || []
      sections.forEach((section) => {
        items.push({
          title: section.title,
          description: section.description ?? null,
          href: `/${section.slug}`,
          type: 'section',
          searchText: buildSearchText(section.title, section.description),
        })
      })

      // SubSections
      const subSections = subSectionsData.docs || []
      subSections.forEach((sub) => {
        const sectionSlug = typeof sub.section === 'string' ? sub.section : sub.section?.slug || ''

        items.push({
          title: sub.title,
          description: sub.description ?? null,
          href: sub.href || `/${sectionSlug}/${sub.slug}`,
          type: 'subSection',
          searchText: buildSearchText(sub.title, sub.description),
          searchTagText: sub.searchSettings?.searchTagText || sub.title,
          searchIcon: sub.searchSettings?.searchIcon as SearchItem['searchIcon'],
        })
      })  

      // Articles
      const articles = articlesData.docs || []
      articles.forEach((article) => {
        items.push({
          title: article.title,
          description: article.description ?? null,
          href: `/${article.section}/${article.subsection}/${article.slug}`,
          type: 'article',
          searchText: buildSearchText(article.title, article.description),
        })
      })

      // 🔥 Сохраняем в кэш с timestamp
      searchCache = items
      cacheTimestamp = Date.now()
      cachePromise = null
      return items
    } catch (error) {
      console.error('❌ Ошибка загрузки данных для поиска:', error)
      cachePromise = null
      return []
    }
  })()

  return cachePromise
}
