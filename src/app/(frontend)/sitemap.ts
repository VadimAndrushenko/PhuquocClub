import type { MetadataRoute } from 'next'
import { getAllArticles, getAllSections, getAllSubsections } from '@/lib/payload/payload'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/help`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // 🔥 Добавляем разделы
  try {
    const sections = await getAllSections()
    for (const section of sections) {
      urls.push({
        url: `${siteUrl}/${section.slug}`,
        lastModified: section.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  } catch (error) {
    console.error('❌ Ошибка добавления разделов в sitemap:', error)
  }

  // 🔥 Добавляем подборки
  try {
    const subsections = await getAllSubsections()
    for (const subsection of subsections) {
      const sectionSlug = typeof subsection.section === 'string' 
        ? subsection.section 
        : (subsection.section as any)?.slug || ''
      
      if (sectionSlug && subsection.slug) {
        urls.push({
          url: `${siteUrl}/${sectionSlug}/${subsection.slug}`,
          lastModified: subsection.updatedAt || new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      }
    }
  } catch (error) {
    console.error('❌ Ошибка добавления подборок в sitemap:', error)
  }

  // 🔥 Добавляем статьи
  try {
    const articles = await getAllArticles()
    for (const article of articles) {
      if (article.href) {
        urls.push({
          url: `${siteUrl}${article.href}`,
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
