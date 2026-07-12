import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ContinuePlanning from '@/components/readyBlock/ContinuePlanning'
import BestSelections from '@/components/readyBlock/BestSelections'
import { SubSectionPageProps } from '@/shared/types/pageType/subSection.type'
import CollectionsBlock from '@/components/readyBlock/CollectionsBlock'
import Hero from '@/components/readyBlock/Hero'

import { getSubsectionBySlugs, getAllSubsections } from '@/lib/payload/subsections'
import { getArticlesBySubsection } from '@/lib/payload/articles'
import { transformSubsection } from '@/lib/transformData/subsectionTransform'
import { buildBreadcrumbItems } from '@/lib/seo/breadcrumbs'
import { BreadcrumbStructuredData, CollectionPageStructuredData } from '@/components/seo/StructuredData'
import { getSectionTitle } from '@/lib/payload/getBreadcrumbsTitles'
import { buildMetadata } from '@/lib/seo/metadata'
import { siteUrl } from '@/lib/seo/config'

// ============================================
// 🔥 СТАТИЧЕСКАЯ ГЕНЕРАЦИЯ (ISR)
// ============================================
export async function generateStaticParams() {
  const locales = ['ru', 'en']
  try {
    const subsections = await getAllSubsections()
    const result = []
    for (const locale of locales) {
      for (const sub of subsections) {
        const sectionSlug = typeof sub.section === 'string' ? sub.section : ''
        if (sectionSlug && sub.slug) {
          result.push({ lang: locale, section: sectionSlug, subSection: sub.slug })
        }
      }
    }
    return result
  } catch (error) {
    console.error('❌ Ошибка generateStaticParams для subsections:', error)
    return []
  }
}

export const revalidate = 30

// ============================================
// 📄 МЕТАДАННЫЕ (СТАТИЧНЫЕ)
// ============================================
export async function generateMetadata({ params }: SubSectionPageProps): Promise<Metadata> {
  const { section, subSection, lang } = await params
  const subsection = await getSubsectionBySlugs(subSection, lang || 'ru')

  if (!subsection) {
    return {
      title: lang === 'en' ? 'Collection not found' : 'Подборка не найдена',
      description: lang === 'en' ? 'This collection does not exist' : 'Такой подборки не существует',
    }
  }

  const img = typeof subsection.image === 'object' && subsection.image !== null
    ? { url: subsection.image.url || '', alt: subsection.image.alt || '' }
    : null

  return buildMetadata({
    title: subsection.seo?.title ?? subsection.title,
    description: subsection.seo?.description ?? subsection.description ?? '',
    keywords: subsection.seo?.keywords,
    path: `/${section}/${subSection}`,
    image: img,
    locale: lang,
  })
}

// ============================================
// 🎯 СТРАНИЦА
// ============================================
const classPY = 'py-10 max-md:py-6'

export default async function SubSectionPage({ params }: SubSectionPageProps) {
  const { subSection: subsectionSlug, section: sectionSlug, lang } = await params

  // Получаем подборку
  const rawSubsection = await getSubsectionBySlugs(subsectionSlug, lang || 'ru')
  // все статьи этого раздела
  const rawArticle = await getArticlesBySubsection(subsectionSlug, lang || 'ru')

  if (!rawSubsection) notFound()

  const { heroData, bestCollectionData, continuePlanning } =
    await transformSubsection(rawSubsection, lang || 'ru')

  // 🔥 Получаем заголовок раздела для хлебных крошек
  const sectionTitle = await getSectionTitle(sectionSlug, lang || 'ru')

  // 🔥 Строим breadcrumb items для Schema.org
  const breadcrumbItems = buildBreadcrumbItems({
    section: sectionSlug,
    sectionTitle,
    subsection: subsectionSlug,
    subsectionTitle: rawSubsection.title,
    baseUrl: siteUrl,
  })

  const sub = rawSubsection as {
    title?: string
    description?: string
    seo?: { title?: string; description?: string }
  }

  return (
    <div className="container">
      {/* 🔥 Structured Data */}
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <CollectionPageStructuredData
        title={(sub.seo?.title ?? rawSubsection.title) || ''}
        description={(sub.seo?.description ?? rawSubsection.description) || ''}
        siteUrl={`${siteUrl}/${sectionSlug}/${subsectionSlug}`}
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

      <CollectionsBlock
        collections={rawArticle}
        title={lang === 'en' ? 'All collection articles:' : 'Все статьи подборки:'}
        containerClass={classPY}
        itemsPerPage={4}
        locale={lang}
        countLabel={lang === 'en' ? ['article', 'articles', 'articles'] : ['статья', 'статьи', 'статей']}
      />

      {/* 🔗 Продолжить чтение из continueSelection */}
      {continuePlanning.length > 0 && (
        <ContinuePlanning className={classPY} data={continuePlanning} locale={lang} />
      )}
    </div>
  )
}
