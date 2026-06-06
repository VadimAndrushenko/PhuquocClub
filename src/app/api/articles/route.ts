import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/payload'

import type { Where } from 'payload'
import { ArticlesApiResponse } from '@/shared/types/apiType/api.type'

// 🔥 ISR - РЕВАЛИДАЦИЯ КАЖДЫЕ 30 СЕКУНД
export const revalidate = 30
export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '6')
    const category = searchParams.get('category')

    const payload = await getPayloadClient()

    // Формируем where условие
    const where: Where = {
      status: { equals: 'published' },
    }

    if (category) {
      where.category = { equals: category }
    }

    const { docs, totalDocs, totalPages } = await payload.find({
      collection: 'Articles',
      where,
      depth: 2,
      page,
      limit,
      sort: '-createdAt',
    })

    // Трансформируем данные для фронтенда
    const articles = docs.map((article: any) => ({
      id: article.id,
      href: `/${article.section}/${article.subsection}/${article.slug}`,
      category: article.category,
      image: typeof article.image === 'object' ? article.image?.url : article.image,
      title: article.title,
      description: article.description,
      readTime: article.readTime,
    }))

    const response: ArticlesApiResponse = {
      docs: articles,
      totalDocs,
      totalPages,
      page,
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 's-maxage=30, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    console.error('Ошибка API:', error)
    return NextResponse.json({ error: 'Ошибка загрузки статей' }, { status: 500 })
  }
}
