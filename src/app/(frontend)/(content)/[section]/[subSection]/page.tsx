import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ContinuePlanning from '@/components/readyBlock/ContinuePlanning'
import BestSelections from '@/components/readyBlock/BestSelections'
import { SubSectionPageProps } from '@/shared/types/pageType/subSection.type'
import CollectionsBlock from '@/components/readyBlock/CollectionsBlock'
import Hero from '@/components/readyBlock/Hero'

import { getSubsectionBySlugs, getArticlesBySubsection, getAllSubsections } from '@/lib/payload/payload'
import { transformSubsection } from '@/lib/subsectionTransform'
import { buildBreadcrumbItems } from '@/lib/seo/breadcrumbs'
import { BreadcrumbStructuredData, CollectionPageStructuredData } from '@/components/seo/StructuredData'
import { getSectionTitle } from '@/lib/payload/getBreadcrumbsTitles'

// ============================================
// 🔥 СТАТИЧЕСКАЯ ГЕНЕРАЦИЯ (ISR)
// ============================================
export async function generateStaticParams() {
  try {
    const subsections = await getAllSubsections()

    return subsections
      .filter((sub) => {
        const sectionSlug = typeof sub.section === 'string' ? sub.section : ''
        return sectionSlug && sub.slug
      })
      .map((sub) => ({
        section: typeof sub.section === 'string' ? sub.section : '',
        subSection: sub.slug || '',
      }))
  } catch (error) {
    console.error('❌ Ошибка generateStaticParams для subsections:', error)
    // 🔥 Возвращаем пустой массив - страницы будут сгенерированы on-demand но останутся статическими!
    return []
  }
}

export const dynamic = 'force-static'
export const revalidate = 30

// ============================================
// 📄 МЕТАДАННЫЕ (СТАТИЧНЫЕ)
// ============================================
export async function generateMetadata({ params }: SubSectionPageProps): Promise<Metadata> {
  const { section, subSection } = await params
  const subsection = await getSubsectionBySlugs(subSection)

  if (!subsection) {
    return {
      title: 'Подборка не найдена',
      description: 'Такой подборки не существует',
    }
  }

  const sub = subsection as {
    title?: string
    description?: string
    seo?: { title?: string; description?: string; keywords?: Array<{ keyword: string }> }
    image?: any
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const subsectionUrl = `${siteUrl}/${section}/${subSection}`
  const imageUrl = typeof sub.image === 'object' && sub.image !== null 
    ? 'url' in sub.image 
      ? sub.image.url 
      : '' 
    : ''

  return {
    title: sub.seo?.title ?? sub.title,
    description: sub.seo?.description ?? sub.description ?? '',
    keywords: sub.seo?.keywords?.map((k) => k.keyword).filter(Boolean) as string[] || [],
    alternates: {
      canonical: subsectionUrl,
    },
    openGraph: {
      title: sub.seo?.title ?? sub.title,
      description: sub.seo?.description ?? sub.description ?? '',
      type: 'website',
      images: imageUrl ? [{ url: imageUrl, alt: sub.title || '' }] : [],
      locale: 'ru_RU',
      siteName: 'Фукуок.Гид',
    },
    twitter: {
      card: 'summary_large_image',
      title: sub.seo?.title ?? sub.title,
      description: sub.seo?.description ?? sub.description ?? '',
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

// ============================================
// 🎯 СТРАНИЦА
// ============================================
const classPY = 'py-10 max-md:py-6'

export default async function SubSectionPage({ params }: SubSectionPageProps) {
  const { subSection: subsectionSlug, section: sectionSlug } = await params

  // Получаем подборку
  const rawSubsection = await getSubsectionBySlugs(subsectionSlug)
  // все статьи этого раздела
  const rawArticle = await getArticlesBySubsection(subsectionSlug)

  if (!rawSubsection) notFound()

  const { heroData, bestCollectionData, continuePlanning } =
    await transformSubsection(rawSubsection)

  // 🔥 Получаем заголовок раздела для хлебных крошек
  const sectionTitle = await getSectionTitle(sectionSlug)

  // 🔥 Строим breadcrumb items для Schema.org
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
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

      <CollectionsBlock
        collections={rawArticle}
        title={`Все статьи подборки: `}
        containerClass={classPY}
        itemsPerPage={4}
      />

      {/* 🔗 Продолжить чтение из continueSelection */}
      {continuePlanning.length > 0 && (
        <ContinuePlanning className={classPY} data={continuePlanning} />
      )}
    </div>
  )
}
