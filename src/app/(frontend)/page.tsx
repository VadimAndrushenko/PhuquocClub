import Collections from '@/dataPage/mainDataPage/SectonCollections'
import Planning from '@/dataPage/mainDataPage/SectonPlanning'
import Popular from '@/dataPage/mainDataPage/SectonPopular'
import Urgent from '@/dataPage/mainDataPage/SectonUrgent'
import HeroMain from '@/dataPage/mainDataPage/HeroMain'
import { getHomePage } from '@/lib/payload/payload'
import { transformHomePage } from '@/lib/homePageTransform'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const classContent = 'py-10 max-sm:py-8 container'

// ============================================
// 🔥 ISR - РЕВАЛИДАЦИЯ КАЖДЫЕ 30 СЕКУНД
// ============================================
export const revalidate = 30
export const dynamic = 'force-static'

// ============================================
// 📄 МЕТАДАННЫЕ (СТАТИЧНЫЕ)
// ============================================
export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage()

  if (!page) {
    return {
      title: 'Гид по Фукуоку',
      description: 'Всё что нужно туристу - быстро и понятно',
    }
  }

  return {
    title: page.seo?.title ?? 'Гид по Фукуоку',
    description: page.seo?.description ?? 'Всё что нужно туристу - быстро и понятно',
    keywords: page.seo?.keywords?.map((k: { keyword?: string | null }) => k.keyword || '') || [],
  }
}

// ============================================
// 🎯 СТРАНИЦА
// ============================================

export default async function Home() {
  const page = await getHomePage()

  if (!page || page.status !== 'published') {
    // В продакшене показываем 404, в деве можно показать дефолт
    if (process.env.NODE_ENV === 'production') {
      notFound()
    }
  }

  const { heroData, popularArticles, planningArticles, collectionsData, urgentArticles } = page
    ? transformHomePage(page)
    : getFallbackData()

  return (
    <div>
      <HeroMain containerClass={classContent} dataMain={heroData} />
      <Popular containerClass={classContent} data={popularArticles} />
      <Planning containerClass={classContent} data={planningArticles} />
      <Collections containerClass={classContent} data={collectionsData} />
      <Urgent containerClass={classContent} data={urgentArticles} />
    </div>
  )
}

// ============================================
// 🔧 FALLBACK ДАННЫЕ (если глобал не настроен)
// ============================================
function getFallbackData() {
  return {
    heroData: {
      title: 'Гид по Фукуоку',
      description: 'Всё что нужно туристу - быстро и понятно',
      image: { url: '/hero-image.jpg', alt: 'Гид по Фукуоку' },
      search: {
        placeholder: 'Поиск по сайту: пляжи, отели, еда, транспорт...',
        tags: [] as Array<{ id?: string | number | null; title: string; icon: any }>,
      },
    },
    popularArticles: [],
    planningArticles: [],
    collectionsData: [],
    urgentArticles: [],
  }
}
