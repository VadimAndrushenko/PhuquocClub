import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ContinuePlanning from '@/components/readyBlock/ContinuePlanning'
import BestSelections from '@/components/readyBlock/BestSelections'
import CollectionsBlock from '@/components/readyBlock/CollectionsBlock'
import Hero from '@/components/readyBlock/Hero'

import { getCollectionsPage } from '@/lib/payload/globals'
import { getAllSubsectionsCards } from '@/lib/payload/subsections'
import { transformCollectionsPage } from '@/lib/transformData/collectionsPageTransform'
import { CollectionPageStructuredData } from '@/components/seo/StructuredData'
import { buildMetadata } from '@/lib/seo/metadata'
import { siteUrl } from '@/lib/seo/config'
import { withLocale } from '@/lib/locale'

// ============================================
// ISR 
// ============================================
export const revalidate = 30

export async function generateStaticParams() {
  return [{ lang: 'ru' }, { lang: 'en' }]
}

// ============================================
// МЕТАДАННЫЕ (СТАТИЧНЫЕ)
// ============================================
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const page = await getCollectionsPage(lang)

  if (!page) {
    return {
      title: lang === 'en' ? 'Collections' : 'Подборки',
      description: lang === 'en' ? 'All collections' : 'Все подборки',
    }
  }

  const img = typeof page.image === 'object' && page.image !== null
    ? { url: page.image.url || '', alt: page.image.alt || '' }
    : null

  return buildMetadata({
    title: page.seo?.title ?? page.title,
    description: page.seo?.description ?? page.description ?? '',
    keywords: page.seo?.keywords,
    path: withLocale('/collections', lang || 'ru'),
    image: img,
    locale: lang,
  })
}

// ============================================
// 🎯 СТРАНИЦА
// ============================================
const classPY = 'py-10 max-md:py-6'

export default async function CollectionsPageRoute({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  // Настройки страницы (Global)
  const page = await getCollectionsPage(lang)
  // ВСЕ подборки из базы
  const allSubsections = await getAllSubsectionsCards(lang)

  if (!page || page.status !== 'published') notFound()

  const { heroData, bestCollectionData, continuePlanning } = transformCollectionsPage(page, lang || 'ru')

  return (
    <div className="container">
      {/* 🔥 Structured Data */}
      <CollectionPageStructuredData
        title={(page.seo?.title ?? page.title) || ''}
        description={(page.seo?.description ?? page.description) || ''}
        siteUrl={`${siteUrl}${withLocale('/collections', lang || 'ru')}`}
      />

      <Hero
        dataHero={heroData}
        locale={lang || 'ru'}
        classes={{
          container: `${classPY}`,
          content: 'lg:max-w-[550px] lg:max-xl:max-w-[430px]',
          title: 'text-5xl max-sm:text-[8vw]',
          image: 'w-[620px] h-auth',
        }}
      />

      {/* ⭐ Лучшие подборки из bestSelection */}
      {bestCollectionData.length > 0 && (
        <BestSelections className={classPY} data={bestCollectionData} locale={lang} />
      )}

      {/* 📚 ВСЕ подборки из базы */}
      <CollectionsBlock
        collections={allSubsections}
        haveCategories={true}
        title={lang === 'en' ? 'All collections:' : 'Все подборки:'}
        containerClass={classPY}
        itemsPerPage={6}
        locale={lang}
      />

      {/* 🔗 Продолжить чтение из continueSelection */}
      {continuePlanning.length > 0 && (
        <ContinuePlanning className={classPY} data={continuePlanning} locale={lang} />
      )}
    </div>
  )
}
