import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ContinuePlanning from '@/components/readyBlock/ContinuePlanning'
import BestSelections from '@/components/readyBlock/BestSelections'
import CollectionsBlock from '@/components/readyBlock/CollectionsBlock'
import Hero from '@/components/readyBlock/Hero'

import { getSubsectionBySlugs, getArticlesBySubsection } from '@/lib/payload/payload'
import { transformSubsection } from '@/lib/subsectionTransform'

import type { SubSectionPageProps } from '@/shared/types/pageType/subSection.type'

// ============================================
// 🔥 СТАТИЧЕСКАЯ ГЕНЕРАЦИЯ
// ============================================
// export async function generateStaticParams() {
//   const subsections = await getAllSubsections()

//   return subsections
//     .filter((sub) => {
//       const sectionSlug =
//         typeof sub.section === 'string' ? sub.section : ''
//       return sectionSlug && sub.slug
//     })
//     .map((sub) => ({
//       section: typeof sub.section === 'string' ? sub.section : '',
//       subSection: sub.slug || '',
//     }))
// }

// export const dynamic = 'force-static'
// export const revalidate = 10

// ============================================
// 📄 МЕТАДАННЫЕ
// ============================================
// export async function generateMetadata({
//   params,
// }: SubSectionPageProps): Promise<Metadata> {
//   const { section, subSection } = await params
//   const subsection = await getSubsectionBySlugs(section, subSection)

//   if (!subsection) {
//     return {
//       title: 'Подборка не найдена',
//       description: 'Такой подборки не существует',
//     }
//   }

//   const sub = subsection as {
//     title?: string
//     description?: string
//     seo?: { title?: string; description?: string; keywords?: Array<{ keyword: string }> }
//   }

//   return {
//     title: sub.seo?.title ?? sub.title,
//     description: sub.seo?.description ?? sub.description ?? '',
//     keywords: sub.seo?.keywords?.map((k) => k.keyword) || [],
//   }
// }

// ============================================
// 🎯 СТРАНИЦА
// ============================================
const classPY = 'py-10 max-md:py-6'

export default async function SubSectionPage({ params }: SubSectionPageProps) {
  const { subSection: subsectionSlug } = await params

  // Получаем подборку
  const rawSubsection = await getSubsectionBySlugs(subsectionSlug)
  // все статьи этого раздела
  const rawArticle = await getArticlesBySubsection(subsectionSlug)

  if (!rawSubsection) notFound()

  const { heroData, bestCollectionData, continuePlanning } =
    await transformSubsection(rawSubsection)

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

      <BestSelections className={classPY} data={bestCollectionData} />

      <CollectionsBlock
        collections={rawArticle}
        title={`Все статьи подборки: ${heroData.title}`}
        containerClass={classPY}
        itemsPerPage={4}
      />

      <ContinuePlanning className={classPY} data={continuePlanning} />
    </div>
  )
}
