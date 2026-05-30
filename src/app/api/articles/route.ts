import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '6')
    const category = searchParams.get('category')

    const payload = await getPayloadClient()

    // Формируем where условие
    const where: any = {
      status: { equals: 'published' },
    }

    if (category) {
      where.category = { equals: category }
    }

    const { docs, totalDocs, totalPages } = await payload.find({
      collection: 'articles',
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

    return NextResponse.json({
      docs: articles,
      totalDocs,
      totalPages,
      page,
    })
  } catch (error) {
    console.error('Ошибка API:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки статей' },
      { status: 500 }
    )
  }
}