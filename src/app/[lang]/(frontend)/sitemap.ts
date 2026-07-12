import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/payload/articles'
import { getAllSections } from '@/lib/payload/sections'
import { getAllSubsections } from '@/lib/payload/subsections'
import { siteUrl } from '@/lib/seo/config'
import { Section } from '@/payload-types'

function addUrls(locale: string): MetadataRoute.Sitemap {
  const prefix = locale === 'en' ? '/en' : ''
  const urls: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}${prefix}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}${prefix}/help`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}${prefix}/collections`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  try {
    const sections = getAllSections()
    for (const section of sections as any) {
      urls.push({
        url: `${siteUrl}${prefix}/${section.slug}`,
        lastModified: section.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  } catch (error) {
    console.error('❌ Ошибка добавления разделов в sitemap:', error)
  }

  try {
    const subsections = getAllSubsections()
    for (const subsection of subsections as any) {
      const sectionSlug = typeof subsection.section === 'string' 
        ? subsection.section 
        : (subsection.section as Section)?.slug || ''
      if (sectionSlug && subsection.slug) {
        urls.push({
          url: `${siteUrl}${prefix}/${sectionSlug}/${subsection.slug}`,
          lastModified: subsection.updatedAt || new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      }
    }
  } catch (error) {
    console.error('❌ Ошибка добавления подборок в sitemap:', error)
  }

  try {
    const articles = getAllArticles()
    for (const article of articles as any) {
      if (article.href) {
        urls.push({
          url: `${siteUrl}${prefix}${article.href}`,
          lastModified: article.updatedAt || new Date(),
          changeFrequency: 'monthly',
          priority: 0.5,
        })
      }
    }
  } catch (error) {
    console.error('❌ Ошибка добавления статей в sitemap:', error)
  }

  return urls
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [...addUrls('ru'), ...addUrls('en')]
}
