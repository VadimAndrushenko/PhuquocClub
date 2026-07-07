import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/payload'
import type { SearchItem, SearchResponse } from '@/lib/search/types'

interface PayloadSection {
  id: string | number
  title: string
  slug: string
  description?: string | null
  status: 'draft' | 'published'
}

interface PayloadSubSection {
  id: string | number
  title: string
  slug: string
  section: string | { slug: string; id: string | number }
  description?: string | null
  href?: string
  status: 'draft' | 'published'
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
  subsection?: string | number | { slug: string; id: string | number }
  description?: string | null
  href?: string
  status: 'draft' | 'published'
}

function buildSearchText(title: string, description?: string | null): string {
  const parts = [title, description].filter(Boolean).join(' ')
  return parts.toLowerCase().trim()
}

function getSectionSlug(section: string | { slug: string; id: string | number }): string {
  return typeof section === 'string' ? section : section.slug
}

export async function GET() {
  try {
    const payload = await getPayloadClient()

    const [sectionsResult, subsectionsResult, articlesResult] = await Promise.allSettled([
      payload.find({
        collection: 'sections',
        where: { status: { equals: 'published' } },
        depth: 0,
        pagination: false,
      }),
      payload.find({
        collection: 'subsections',
        where: { status: { equals: 'published' } },
        depth: 1,
        pagination: false,
      }),
      payload.find({
        collection: 'Articles',
        where: { status: { equals: 'published' } },
        depth: 0,
        pagination: false,
      }),
    ])

    const items: SearchItem[] = []

    // Build subsection lookup: id → { slug, sectionSlug }
    const subsectionMap = new Map<string | number, { slug: string; sectionSlug: string }>()
    if (subsectionsResult.status === 'fulfilled') {
      const subsections = subsectionsResult.value.docs as PayloadSubSection[]
      subsections.forEach((sub) => {
        const sectionSlug = getSectionSlug(sub.section)
        subsectionMap.set(sub.id, { slug: sub.slug, sectionSlug })
      })
    }

    if (sectionsResult.status === 'fulfilled') {
      const sections = sectionsResult.value.docs as PayloadSection[]
      sections.forEach((section) => {
        items.push({
          id: `section-${section.id}`,
          title: section.title,
          description: section.description ?? null,
          href: `/${section.slug}`,
          type: 'section',
          searchText: buildSearchText(section.title, section.description),
        })
      })
    }

    if (subsectionsResult.status === 'fulfilled') {
      const subsections = subsectionsResult.value.docs as PayloadSubSection[]
      subsections.forEach((sub) => {
        const sectionSlug = getSectionSlug(sub.section)
        items.push({
          id: `subsection-${sub.id}`,
          title: sub.title,
          description: sub.description ?? null,
          href: `/${sectionSlug}/${sub.slug}`,
          type: 'subsection',
          searchText: buildSearchText(sub.title, sub.description),
          searchTagText: sub.searchSettings?.searchTagText,
          searchIcon: sub.searchSettings?.searchIcon,
        })
      })
    }

    if (articlesResult.status === 'fulfilled') {
      const articles = articlesResult.value.docs as PayloadArticle[]
      articles.forEach((article) => {
        const subData =
          article.subsection
            ? typeof article.subsection === 'object'
              ? subsectionMap.get(article.subsection.id)
              : subsectionMap.get(article.subsection)
            : undefined

        const href =
          article.href ||
          (subData ? `/${subData.sectionSlug}/${subData.slug}/${article.slug}` : `/${article.slug}`)

        items.push({
          id: `article-${article.id}`,
          title: article.title,
          description: article.description ?? null,
          href,
          type: 'article',
          searchText: buildSearchText(article.title, article.description),
        })
      })
    }

    const response: SearchResponse = { items, total: items.length, timestamp: Date.now() }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    console.error('Search API Error:', error)

    return NextResponse.json(
      { items: [], total: 0, timestamp: Date.now(), error: 'Failed to fetch search data' },
      { status: 500, headers: { 'Cache-Control': 'no-cache' } },
    )
  }
}

export const revalidate = 30
