import type { Metadata } from 'next'
import { siteUrl } from './config'

export interface BuildMetadataInput {
  title: string
  description: string
  keywords?: Array<{ id?: string | null; keyword?: string | null }> | null
  noIndex?: boolean | null
  path?: string
  image?: { url: string; alt: string } | null
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
  authors?: string[]
  locale?: string
}

export function buildMetadata(seo: BuildMetadataInput): Metadata {
  const canonical = seo.path ? `${siteUrl}${seo.path}` : siteUrl
  const images = seo.image?.url ? [{ url: seo.image.url, alt: seo.image.alt }] : []
  const twitterImages = seo.image?.url ? [seo.image.url] : []

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.map((k) => k.keyword).filter(Boolean) as string[] | undefined,
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    alternates: { canonical },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      type: seo.type || 'website',
      images: images.length > 0 ? images : undefined,
      locale: seo.locale === 'en' ? 'en_US' : 'ru_RU',
      siteName: seo.locale === 'en' ? 'Phu Quoc Guide' : 'Фукуок.Гид',
      ...(seo.type === 'article' && seo.publishedTime ? { publishedTime: seo.publishedTime } : {}),
      ...(seo.type === 'article' && seo.modifiedTime ? { modifiedTime: seo.modifiedTime } : {}),
      ...(seo.type === 'article' && seo.authors ? { authors: seo.authors } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: twitterImages.length > 0 ? twitterImages : undefined,
    },
  }
}
