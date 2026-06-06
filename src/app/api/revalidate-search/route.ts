import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * 🔥 ISR API ENDPOINT - для принудительной ревалидации
 *
 * Вызывается:
 * 1. По расписанию (cron) каждые 30 секунд
 * 2. При изменениях в Payload CMS (webhook)
 *
 * Примеры:
 * - GET /api/revalidate-search?secret=YOUR_SECRET
 * - POST /api/revalidate-search с { secret: 'YOUR_SECRET', paths: [...] }
 */

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'default-secret-change-me'

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  try {
    // 🔥 Реалидуем все ключевые пути
    revalidatePath('/')
    revalidatePath('/collections')
    revalidatePath('/help')

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: 'Статический кэш обновлён (ISR)',
    })
  } catch (err) {
    console.error('❌ Ошибка ревалидации:', err)
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { paths } = body || {}

    // 🔥 Реалидуем конкретные пути
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path)
      }
    }

    // 🔥 Если ничего не указано - реалидуем всё
    if (!paths || paths.length === 0) {
      revalidatePath('/')
      revalidatePath('/collections')
      revalidatePath('/help')
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      paths: paths || [],
      message: 'Статический кэш обновлён (ISR)',
    })
  } catch (err) {
    console.error('❌ Ошибка ревалидации:', err)
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 })
  }
}
