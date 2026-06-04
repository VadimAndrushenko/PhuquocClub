import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ContinuePlanning from '@/components/readyBlock/ContinuePlanning'
import BestSelections from '@/components/readyBlock/BestSelections'
import { SectionPageProps } from '@/shared/types/pageType/section.type'
import CollectionsBlock from '@/components/readyBlock/CollectionsBlock'
import Hero from '@/components/readyBlock/Hero'

import { getSectionBySlugs, getSubsectionsBySection } from '@/lib/payload/payload'
import { transformSection } from '@/lib/sectionTransform'

// ============================================
// 🔧 HELPER
// ============================================
function declOfNum(number: number, titles: [string, string, string]): string {
  const cases = [2, 0, 1, 1, 1, 2]
  return titles[
    number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]
  ]
}

// ============================================
// 🔥 СТАТИЧЕСКАЯ ГЕНЕРАЦИЯ
// ============================================
// export async function generateStaticParams() {
//   const sections = await getAllSections()
//   return sections.map((section) => ({
//     section: section.slug,
//   }))
// }

// export const dynamic = 'force-static'
// export const revalidate = 10

// ============================================
// 📄 МЕТАДАННЫЕ
// ============================================
// export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
//   const { section: sectionSlug } = await params
//   const section = await getSectionBySlugs(sectionSlug)

//   if (!section) {
//     return {
//       title: 'Раздел не найден',
//       description: 'Такой раздел не существует',
//     }
//   }

//   return {
//     title: section.title,
//     description: section.description ?? '',
//   }
// }

// ============================================
// 🎯 СТРАНИЦА
// ============================================
const classPY = 'py-10 max-md:py-6'

export default async function SectionPage({ params }: SectionPageProps) {
  const { section: sectionSlug } = await params

  // Получаем секцию
  const rawSection = await getSectionBySlugs(sectionSlug)
  // все subsections этой секции
  const rawSubsections = await getSubsectionsBySection(sectionSlug)

  if (!rawSection) notFound()

  const { heroData, bestCollectionData, continuePlanning } = await transformSection(rawSection)

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

      {/* 📚 Все subsections секции */}
      <CollectionsBlock
        collections={rawSubsections}
        haveCategories={true}
        title={`Все подборки раздела: ${heroData.title}`}
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