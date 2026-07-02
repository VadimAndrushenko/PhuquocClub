import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ContinuePlanning from '@/components/readyBlock/ContinuePlanning'
import BestSelections from '@/components/readyBlock/BestSelections'
import { SectionPageProps } from '@/shared/types/pageType/section.type'
import CollectionsBlock from '@/components/readyBlock/CollectionsBlock'
import Hero from '@/components/readyBlock/Hero'

import { getSectionBySlugs, getSubsectionsBySection, getAllSections } from '@/lib/payload/sections'
import { transformSection } from '@/lib/transformData/sectionTransform'
import { buildBreadcrumbItems } from '@/lib/seo/breadcrumbs'
import { BreadcrumbStructuredData, CollectionPageStructuredData } from '@/components/seo/StructuredData'
import { buildMetadata } from '@/lib/seo/metadata'
import { siteUrl } from '@/lib/seo/config'

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
// 🔥 СТАТИЧЕСКАЯ ГЕНЕРАЦИЯ (ISR)
// ============================================
export async function generateStaticParams() {
  try {
    const sections = await getAllSections()
    return sections.map((section) => ({
      section: section.slug,
    }))
  } catch (error) {
    console.error('❌ Ошибка generateStaticParams для sections:', error)
    // 🔥 Возвращаем пустой массив - страницы будут сгенерированы on-demand но останутся статическими!
    return []
  }
}

export const dynamic = 'force-static'
export const revalidate = 30

// ============================================
// 📄 МЕТАДАННЫЕ (СТАТИЧНЫЕ)
// ============================================
export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { section: sectionSlug } = await params
  const section = await getSectionBySlugs(sectionSlug)

  if (!section) {
    return {
      title: 'Раздел не найден',
      description: 'Такой раздел не существует',
    }
  }

  const img = typeof section.image === 'object' && section.image !== null
    ? { url: section.image.url || '', alt: section.image.alt || '' }
    : null

  return buildMetadata({
    title: section.seo?.title ?? section.title,
    description: section.seo?.description ?? section.description ?? '',
    keywords: section.seo?.keywords,
    path: `/${section.slug}`,
    image: img,
  })
}

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

  // 🔥 Строим breadcrumb items для Schema.org
  const breadcrumbItems = buildBreadcrumbItems({
    section: sectionSlug,
    sectionTitle: rawSection.title,
    baseUrl: siteUrl,
  })

  return (
    <div className="container">
      {/* 🔥 Structured Data */}
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <CollectionPageStructuredData
        title={rawSection.seo?.title ?? rawSection.title}
        description={rawSection.seo?.description ?? rawSection.description ?? ''}
        siteUrl={`${siteUrl}/${sectionSlug}`}
      />

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
        title={`Все подборки раздела:`}
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
