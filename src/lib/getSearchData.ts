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
  return `${title} ${description ?? ""}`.toLowerCase()
}

// ============================================
// 🔥 ГЛАВНАЯ ФУНКЦИЯ
// ============================================

export async function getSearchData(): Promise<SearchItem[]> {
  try {
    const [sectionsRes, subSectionsRes, articlesRes] = await Promise.all([
      fetch(
        `${BASE_URL}/api/sections?where[status][equals]=published&depth=0&pagination=false`,
        { cache: 'no-store' }
      ),
      fetch(
        `${BASE_URL}/api/subsections?where[status][equals]=published&depth=1&pagination=false`,
        { cache: 'no-store' }
      ),
      fetch(
        `${BASE_URL}/api/Articles?where[status][equals]=published&depth=0&pagination=false`,
        { cache: 'no-store' }
      ),
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
        type: "section",
        searchText: buildSearchText(section.title, section.description),
      })
    })

    // SubSections
    const subSections = subSectionsData.docs || []
    subSections.forEach((sub) => {
      const sectionSlug = typeof sub.section === 'string' 
        ? sub.section 
        : sub.section?.slug || ''
      
      items.push({
        title: sub.title,
        description: sub.description ?? null,
        href: sub.href || `/${sectionSlug}/${sub.slug}`,
        type: "subSection",
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
        href: article.href || `/${article.section}/${article.subsection}/${article.slug}`,
        type: "article",
        searchText: buildSearchText(article.title, article.description),
      })
    })

    return items
  } catch (error) {
    console.error('❌ Ошибка загрузки данных для поиска:', error)
    return []
  }
}