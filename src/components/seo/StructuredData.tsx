import type { Article as ArticleType } from '@/payload-types'

interface ArticleStructuredDataProps {
  article: ArticleType
  siteUrl: string
}

interface BreadcrumbStructuredDataProps {
  items: { position: number; name: string; item: string }[]
}

interface WebSiteStructuredDataProps {
  siteName: string
  siteUrl: string
}

interface CollectionPageStructuredDataProps {
  title: string
  description: string
  siteUrl: string
}

/**
 * 📄 Schema.org для статьи (Article)
 */
export function ArticleStructuredData({ article, siteUrl }: ArticleStructuredDataProps) {
  const articleUrl = `${siteUrl}${article.href}`
  const imageUrl = typeof article.image === 'object' && article.image !== null 
    ? 'url' in article.image 
      ? (article.image as any).url 
      : '' 
    : ''

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.seo?.title || article.title,
    description: article.seo?.description || article.description,
    image: imageUrl,
    url: articleUrl,
    author: {
      '@type': 'Organization',
      name: article.author || 'Phuquoc.Club',
    },
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Phuquoc.Club',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    articleBody: article.intro,
    wordCount: article.intro?.length || 0,
    keywords: article.seo?.keywords?.map((k) => k.keyword).join(', ') || '',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

/**
 * 🍞 Schema.org для хлебных крошек (BreadcrumbList)
 */
export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.item,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

/**
 * 🏠 Schema.org для веб-сайта (WebSite)
 */
export function WebSiteStructuredData({ siteName, siteUrl }: WebSiteStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

/**
 * ℹ️ Schema.org для обычной страницы (WebPage)
 */
export function WebPageStructuredData({
  title,
  description,
  siteUrl,
}: {
  title: string
  description: string
  siteUrl: string
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: siteUrl,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

/**
 * 📚 Schema.org для страницы коллекции (CollectionPage)
 */
export function CollectionPageStructuredData({
  title,
  description,
  siteUrl,
}: CollectionPageStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    headline: title,
    description: description,
    url: siteUrl,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
