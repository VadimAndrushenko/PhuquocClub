import { notFound } from 'next/navigation'
import { getArticleBySlug, getAllArticles } from '@/lib/payload/articles'
import { transformArticle } from '@/lib/transformData/articleTransform'
import type { ArticlePageProps } from '@/shared/types/pageType/article.type'
import type { Metadata } from 'next'
import { buildBreadcrumbItems } from '@/lib/seo/breadcrumbs'
import { ArticleStructuredData, BreadcrumbStructuredData } from '@/components/seo/StructuredData'
import { buildMetadata } from '@/lib/seo/metadata'
import { siteUrl } from '@/lib/seo/config'

import KratkoArticle from '@/dataPage/articleDataPage/sectionArticle/KratkoArticle'
import BodyArticle from '@/dataPage/articleDataPage/sectionArticle/BodyArticle'
import NavigationArticle from '@/dataPage/articleDataPage/sectionArticle/NavigationArticle'
import UsefulArticle from '@/dataPage/articleDataPage/sectionArticle/UsefulArticle'
import RelatedArticles from '@/dataPage/articleDataPage/sectionArticle/RelatedArticles'
import NeedHelpArticle from '@/dataPage/articleDataPage/sectionArticle/NeeHelpArticle'
import HeroArticle from '@/dataPage/articleDataPage/sectionArticle/HeroArticle'

import { getSectionTitle, getSubsectionTitle } from '@/lib/payload/getBreadcrumbsTitles'

// ============================================
// 🔥 СТАТИЧЕСКАЯ ГЕНЕРАЦИЯ (ISR)
// ============================================
export async function generateStaticParams() {
  try {
    const articles = await getAllArticles()

    if (!articles || articles.length === 0) {
      return []
    }

    return articles
      .filter((article) => {
        if (!article.subsection) return false
        return true
      })
      .map((article) => {
        const subsectionObj =
          typeof article.subsection === 'object' && article.subsection !== null
            ? article.subsection
            : null

        const subsectionSlug = subsectionObj?.slug || ''
        let sectionSlug = article.section || ''

        if (subsectionObj && 'section' in subsectionObj) {
          const subsectionSection = subsectionObj.section
          if (
            typeof subsectionSection === 'object' &&
            subsectionSection !== null &&
            'slug' in subsectionSection
          ) {
            sectionSlug = subsectionSection.slug
          }
        }

        return {
          section: sectionSlug,
          subSection: subsectionSlug,
          article: article.slug,
        }
      })
  } catch (error) {
    console.error('❌ Ошибка generateStaticParams для статей:', error)
    // 🔥 Возвращаем пустой массив - страницы будут сгенерированы on-demand но останутся статическими!
    return []
  }
}

export const dynamic = 'force-static'
export const revalidate = 30

// ============================================
// 📄 МЕТАДАННЫЕ (СТАТИЧНЫЕ)
// ============================================
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { article: slug } = await params
  const rawArticle = await getArticleBySlug(slug)

  if (!rawArticle) {
    return {
      title: 'Статья не найдена',
      description: 'Такой статьи не существует',
    }
  }

  const img = typeof rawArticle.image === 'object' && rawArticle.image !== null
    ? { url: rawArticle.image.url || '', alt: rawArticle.image.alt || '' }
    : null

  return buildMetadata({
    title: rawArticle.seo?.title ?? rawArticle.title,
    description: rawArticle.seo?.description ?? rawArticle.description ?? '',
    keywords: rawArticle.seo?.keywords,
    path: rawArticle.href || '/',
    image: img,
    type: 'article',
    publishedTime: rawArticle.createdAt,
    modifiedTime: rawArticle.updatedAt,
    authors: [rawArticle.author || 'Phuquoc.Club'],
  })
}

// ============================================
// 🎯 СТРАНИЦА
// ============================================

const classPY = 'py-10 max-md:py-6'

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { article: slug, section: sectionSlug, subSection: subsectionSlug } = await params

  const rawArticle = await getArticleBySlug(slug)

  if (!rawArticle) {
    notFound()
  }

  const { heroData, kratkoItems, sectionBlocks, usefulLinks, relatedArticles } =
    transformArticle(rawArticle)

  // 🔥 Получаем заголовки для хлебных крошек
  const [sectionTitle, subsectionTitle] = await Promise.all([
    getSectionTitle(sectionSlug),
    getSubsectionTitle(subsectionSlug),
  ])

  // 🔥 Строим breadcrumb items для Schema.org
  const breadcrumbItems = buildBreadcrumbItems({
    section: sectionSlug,
    sectionTitle,
    subsection: subsectionSlug,
    subsectionTitle,
    article: slug,
    articleTitle: rawArticle.title,
    baseUrl: siteUrl,
  })

  return (
    <div className="container">
      {/* 🔥 Structured Data */}
      <ArticleStructuredData article={rawArticle} siteUrl={siteUrl} />
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <article>
        <HeroArticle containerClass={classPY} dataArticle={heroData} />

        {kratkoItems.length > 0 && <KratkoArticle containerClass={classPY} items={kratkoItems} />}

        {sectionBlocks.length > 0 && (
          <>
            <NavigationArticle blocks={sectionBlocks} containerClass={classPY} />
            <BodyArticle contentArticle={sectionBlocks} containerClass={classPY} />
          </>
        )}

        {usefulLinks.length > 0 && <UsefulArticle containerClass={classPY} links={usefulLinks} />}

        <NeedHelpArticle containerClass={classPY} />

        {relatedArticles.length > 0 && (
          <RelatedArticles containerClass={classPY} articles={relatedArticles} />
        )}
      </article>
    </div>
  )
}
