import Collections from '@/dataPage/mainDataPage/SectionCollections'
import Planning from '@/dataPage/mainDataPage/SectionPlanning'
import Popular from '@/dataPage/mainDataPage/SectionPopular'
import Urgent from '@/dataPage/mainDataPage/SectionUrgent'
import HeroMain from '@/dataPage/mainDataPage/HeroMain'
import { getHomePage } from '@/lib/payload/globals'
import { transformHomePage } from '@/lib/transformData/homePageTransform'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/metadata'
import { siteUrl } from '@/lib/seo/config'
import { WebSiteStructuredData } from '@/components/seo/StructuredData'

const classContent = 'py-10 max-sm:py-8 container'

// ============================================
// 🔥 ISR - РЕВАЛИДАЦИЯ КАЖДЫЕ 30 СЕКУНД
// ============================================
export const revalidate = 30

export async function generateStaticParams() {
  return [{ lang: 'ru' }, { lang: 'en' }]
}

// ============================================
// 📄 МЕТАДАННЫЕ (СТАТИЧНЫЕ)
// ============================================
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const page = await getHomePage(lang)

  if (!page) {
    return {
      title: lang === 'en' ? 'Phu Quoc Guide' : 'Гид по Фукуоку',
      description: lang === 'en' ? 'Everything a tourist needs - fast and clear' : 'Всё что нужно туристу - быстро и понятно',
    }
  }

  const img = typeof page.heroSection?.image === 'object' && page.heroSection?.image !== null
    ? { url: page.heroSection.image.url || '', alt: page.heroSection.image.alt || '' }
    : null

  return buildMetadata({
    title: page.seo?.title ?? (lang === 'en' ? 'Phu Quoc Guide' : 'Гид по Фукуоку'),
    description: page.seo?.description ?? (lang === 'en' ? 'Everything a tourist needs' : 'Всё что нужно туристу - быстро и понятно'),
    keywords: page.seo?.keywords,
    image: img,
    locale: lang,
  })
}

// ============================================
// 🎯 СТРАНИЦА
// ============================================

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const page = await getHomePage(lang)

  if (!page || page.status !== 'published') {
    if (process.env.NODE_ENV === 'production') {
      notFound()
    }
  }

  const { heroData, popularArticles, planningArticles, collectionsData, urgentArticles } = transformHomePage(page, lang || 'ru')

  return (
    <div>
      <WebSiteStructuredData siteName={lang === 'en' ? 'Phu Quoc Guide' : 'Фукуок.Гид'} siteUrl={`${siteUrl}${lang === 'en' ? '/en' : ''}`} />

      <HeroMain containerClass={classContent} dataMain={heroData} locale={lang} />
      <Popular containerClass={classContent} data={popularArticles} locale={lang} />
      <Planning containerClass={classContent} data={planningArticles} locale={lang} />
      <Collections containerClass={classContent} data={collectionsData} locale={lang} />
      <Urgent containerClass={classContent} data={urgentArticles} locale={lang} />
    </div>
  )
}

