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
  const locales = ['ru', 'en']
  try {
    const sections = await getAllSections()
    const result = []
    for (const locale of locales) {
      for (const section of sections) {
        result.push({ lang: locale, section: section.slug })
      }
    }
    return result
  } catch (error) {
    console.error('❌ Ошибка generateStaticParams для sections:', error)
    return []
  }
}

export const revalidate = 30

// ============================================
// 📄 МЕТАДАННЫЕ (СТАТИЧНЫЕ)
// ============================================
export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { section: sectionSlug, lang } = await params
  const section = await getSectionBySlugs(sectionSlug, lang || 'ru')

  if (!section) {
    return {
      title: lang === 'en' ? 'Section not found' : 'Раздел не найден',
      description: lang === 'en' ? 'This section does not exist' : 'Такой раздел не существует',
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
    locale: lang,
  })
}

// ============================================
// 🎯 СТРАНИЦА
// ============================================
const classPY = 'py-10 max-md:py-6'

export default async function SectionPage({ params }: SectionPageProps) {
  const { section: sectionSlug, lang } = await params

  // Получаем секцию
  const rawSection = await getSectionBySlugs(sectionSlug, lang || 'ru')
  // все subsections этой секции
  const rawSubsections = await getSubsectionsBySection(sectionSlug, lang || 'ru')

  if (!rawSection) notFound()

  const { heroData, bestCollectionData, continuePlanning } = await transformSection(rawSection, lang || 'ru')

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

      {/* 📚 Все subsections секции */}
      <CollectionsBlock
        collections={rawSubsections}
        haveCategories={true}
        title={lang === 'en' ? 'All section collections:' : 'Все подборки раздела:'}
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
