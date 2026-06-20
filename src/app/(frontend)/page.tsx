import Collections from '@/dataPage/mainDataPage/SectonCollections'
import Planning from '@/dataPage/mainDataPage/SectonPlanning'
import Popular from '@/dataPage/mainDataPage/SectonPopular'
import Urgent from '@/dataPage/mainDataPage/SectonUrgent'
import HeroMain from '@/dataPage/mainDataPage/HeroMain'
import { getHomePage } from '@/lib/payload/payload'
import { transformHomePage } from '@/lib/homePageTransform'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { WebSiteStructuredData } from '@/components/seo/StructuredData'

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const imageUrl = typeof page.heroSection?.image === 'object' && page.heroSection?.image !== null 
    ? 'url' in page.heroSection.image 
      ? page.heroSection.image.url 
      : '' 
    : ''

  return {
    title: page.seo?.title ?? 'Гид по Фукуоку',
    description: page.seo?.description ?? 'Всё что нужно туристу - быстро и понятно',
    keywords: page.seo?.keywords?.map((k: { keyword?: string | null }) => k.keyword).filter(Boolean) as string[] || [],
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: page.seo?.title ?? 'Гид по Фукуоку',
      description: page.seo?.description ?? 'Всё что нужно туристу - быстро и понятно',
      type: 'website',
      images: imageUrl ? [{ url: imageUrl, alt: page.seo?.title || 'Гид по Фукуоку' }] : [],
      locale: 'ru_RU',
      siteName: 'Фукуок.Гид',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.seo?.title ?? 'Гид по Фукуоку',
      description: page.seo?.description ?? 'Всё что нужно туристу - быстро и понятно',
      images: imageUrl ? [imageUrl] : [],
    },
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

  const { heroData, popularArticles, planningArticles, collectionsData, urgentArticles } = transformHomePage(page)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return (
    <div>
      {/* 🔥 Structured Data для главной */}
      <WebSiteStructuredData siteName="Фукуок.Гид" siteUrl={siteUrl} />

      <HeroMain containerClass={classContent} dataMain={heroData} />
      <Popular containerClass={classContent} data={popularArticles} />
      <Planning containerClass={classContent} data={planningArticles} />
      <Collections containerClass={classContent} data={collectionsData} />
      <Urgent containerClass={classContent} data={urgentArticles} />
    </div>
  )
}

