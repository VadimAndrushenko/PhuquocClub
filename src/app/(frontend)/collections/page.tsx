import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ContinuePlanning from '@/components/readyBlock/ContinuePlanning'
import BestSelections from '@/components/readyBlock/BestSelections'
import CollectionsBlock from '@/components/readyBlock/CollectionsBlock'
import Hero from '@/components/readyBlock/Hero'

import { getCollectionsPage, getAllSubsectionsCards } from '@/lib/payload/payload'
import { transformCollectionsPage } from '@/lib/collectionsPageTransform'

// ============================================
// 🔥 ISR - РЕВАЛИДАЦИЯ КАЖДЫЕ 30 СЕКУНД
// ============================================
export const revalidate = 30
export const dynamic = 'force-static'

// ============================================
// 📄 МЕТАДАННЫЕ (СТАТИЧНЫЕ)
// ============================================
export async function generateMetadata(): Promise<Metadata> {
  const page = await getCollectionsPage()

  if (!page) {
    return {
      title: 'Подборки',
      description: 'Все подборки',
    }
  }

  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.description ?? page.description ?? '',
    keywords: page.seo?.keywords?.map((k: { keyword?: string | null }) => k.keyword || '') || [],
  }
}

// ============================================
// 🎯 СТРАНИЦА
// ============================================
const classPY = 'py-10 max-md:py-6'

export default async function CollectionsPageRoute() {
  // Настройки страницы (Global)
  const page = await getCollectionsPage()
  // ВСЕ подборки из базы
  const allSubsections = await getAllSubsectionsCards()

  if (!page || page.status !== 'published') notFound()

  const { heroData, bestCollectionData, continuePlanning } = transformCollectionsPage(page)

  return (
    <div className="container">
      <Hero
        dataHero={heroData}
        classes={{
          container: `${classPY}`,
          content: 'lg:max-w-[550px] lg:max-xl:max-w-[430px]',
          title: 'text-5xl max-sm:text-[8vw]',
          image: 'w-[620px] h-auth',
        }}
      />

      {/* ⭐ Лучшие подборки из bestSelection */}
      {bestCollectionData.length > 0 && (
        <BestSelections className={classPY} data={bestCollectionData} />
      )}

      {/* 📚 ВСЕ подборки из базы */}
      <CollectionsBlock
        collections={allSubsections}
        haveCategories={true}
        title={`Все подборки: ${heroData.title}`}
        containerClass={classPY}
        itemsPerPage={6}
      />

      {/* 🔗 Продолжить чтение из continueSelection */}
      {continuePlanning.length > 0 && (
        <ContinuePlanning className={classPY} data={continuePlanning} />
      )}
    </div>
  )
}
