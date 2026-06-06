import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * 🔥 WEBHOOK для Payload CMS - автоматическая ревалидация при изменениях
 *
 * Настройте в Payload CMS:
 * 1. Admin → Settings → Webhooks
 * 2. Создайте webhook с URL: https://your-domain.com/api/webhook/revalidate
 * 3. Метод: POST
 * 4. Trigger: After Change
 * 5. Collections: Articles, sections, subsections
 */

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'default-webhook-secret-change-me'

export async function POST(request: NextRequest) {
  // Проверка секретного ключа
  const secret = request.headers.get('x-webhook-secret')

  if (secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { collection, doc, event } = body || {}

    console.log(`🔔 Webhook: ${event} in ${collection}`, doc?.id)

    // 🔥 Реалидуем пути в зависимости от коллекции
    switch (collection) {
      case 'Articles':
        if (doc?.section && doc?.subsection && doc?.slug) {
          // 🔥 subsection может быть ID или объектом
          const subsectionSlug =
            typeof doc.subsection === 'string'
              ? doc.subsection
              : typeof doc.subsection === 'object'
                ? doc.subsection.slug
                : ''

          const sectionSlug = typeof doc.section === 'string' ? doc.section : ''

          if (sectionSlug && subsectionSlug) {
            revalidatePath(`/${sectionSlug}/${subsectionSlug}/${doc.slug}`)
          }
        }
        // Реалидуем страницы которые могут содержать статью
        revalidatePath('/')
        break

      case 'sections':
        if (doc?.slug) {
          revalidatePath(`/${doc.slug}`)
        }
        revalidatePath('/')
        break

      case 'subsections':
        if (doc?.section && doc?.slug) {
          const sectionSlug =
            typeof doc.section === 'string'
              ? doc.section
              : typeof doc.section === 'object'
                ? doc.section.slug
                : ''
          if (sectionSlug) {
            revalidatePath(`/${sectionSlug}/${doc.slug}`)
          }
        }
        break

      case 'media':
        // При изменении медиа - реалидуем всё
        revalidatePath('/')
        revalidatePath('/collections')
        break

      default:
        // Для глобалов и других коллекций
        revalidatePath('/')
        revalidatePath('/collections')
        revalidatePath('/help')
    }

    return NextResponse.json({
      success: true,
      message: 'Revalidation triggered',
      collection,
      docId: doc?.id,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
