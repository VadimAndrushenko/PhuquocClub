import type { Metadata } from 'next'
import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google'
import './globals.css'

import { cn } from '@/lib/utils'
import { Header, type NavigationItem } from '@/components/layout/header'
import { Footer, type FooterNavSection, type AdditionalLink } from '@/components/layout/footer'
import { SearchProvider } from '@/contexts/SearchContext'
import { getHeader, getFooter } from '@/lib/payload/globals'
import type {
  Footer as FooterPayload,
  Header as HeaderPayload,
  Section,
  Subsection,
  Article,
} from '@/payload-types'
import { withLocale } from '@/lib/locale'

// ===============================
// 🔥 ISR - РЕВАЛИДАЦИЯ КАЖДЫЕ 30 СЕКУНД
// ===============================
export const revalidate = 30

export async function generateStaticParams() {
  return [{ lang: 'ru' }, { lang: 'en' }]
}

// ===============================
// Fonts
// ===============================
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// ===============================
// Helpers
// ===============================

interface ResolvableLink {
  linkType: string
  externalUrl?: string | null
  section?: Section | number | null
  subsection?: Subsection | number | null
  article?: Article | number | null
}

function getSlug(field: unknown): string {
  if (!field) return ''
  if (typeof field === 'object' && field !== null && 'slug' in field) return (field as { slug: string }).slug || ''
  if (typeof field === 'string') return field
  return ''
}

function resolveLinkHref(link: ResolvableLink, locale: string): string {
  let path = '/'
  switch (link.linkType) {
    case 'external':
      return link.externalUrl || '/'
    case 'section': {
      const slug = getSlug(link.section)
      if (slug) path = `/${slug}`
      break
    }
    case 'subsection': {
      const sub = getSlug(link.subsection)
      if (!sub) break
      const s = link.subsection
      const sectionField = typeof s === 'object' && s !== null ? (s as unknown as Record<string, unknown>).section : undefined
      const sectionSlug = getSlug(sectionField)
      const subSlug = getSlug(sub)
      if (sectionSlug && subSlug) path = `/${sectionSlug}/${subSlug}`
      break
    }
    case 'article': {
      const art = getSlug(link.article)
      if (!art) break
      const a = link.article
      if (typeof a !== 'object' || a === null) break
      const articleData = a as unknown as Record<string, unknown>
      const sectionSlug = typeof articleData.section === 'string' ? articleData.section : ''
      const subField = articleData.subsection
      const subsectionSlug = getSlug(subField)
      const artSlug = typeof articleData.slug === 'string' ? articleData.slug : ''
      if (sectionSlug && subsectionSlug && artSlug) path = `/${sectionSlug}/${subsectionSlug}/${artSlug}`
      break
    }
  }
  return withLocale(path, locale)
}

function headerToNavItems(header: HeaderPayload, locale: string): NavigationItem[] {
  return (header.navigationItems || []).map((item) => ({
    id: item.id || '',
    title: item.title,
    href: resolveLinkHref(item, locale),
    icon: item.icon,
    linkType: item.linkType,
  }))
}

function footerToNavSections(footer: FooterPayload, locale: string): FooterNavSection[] {
  return (footer.sections || []).map((section) => ({
    title: section.sectionTitle,
    items: (section.links || []).map((link) => ({
      label: link.label,
      href: resolveLinkHref(link, locale),
    })),
  }))
}

function footerToAdditionalLinks(footer: FooterPayload, locale: string): AdditionalLink[] {
  return (footer.bottomLinks || []).map((link, idx) => ({
    id: link.id || idx + 1,
    title: link.title,
    href: resolveLinkHref(link, locale),
  }))
}

// ===============================
// Root Layout
// ===============================

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  const headerData = await getHeader(lang)
  const footerData = await getFooter(lang)

  const headerNavigationItems = headerData ? headerToNavItems(headerData, lang) : []

  const footerDescription = footerData?.description || undefined
  const footerSocialLinks = footerData?.socialLinks || undefined
  const footerNavigationSections = footerData ? footerToNavSections(footerData, lang) : undefined
  const footerAdditionalLinks = footerData ? footerToAdditionalLinks(footerData, lang) : undefined

  return (
    <html
      lang={lang}
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        jetbrainsMono.variable,
      )}
    >
      <body className="min-h-screen flex flex-col bg-background text-main">
        <SearchProvider>
          <Header navigationItems={headerNavigationItems} currentLang={lang} />
          <main id="main-content" className="relative flex-1">{children}</main>
          <Footer
            description={footerDescription}
            socialLinks={footerSocialLinks}
            navigationSections={footerNavigationSections}
            additionalLinks={footerAdditionalLinks}
            locale={lang}
          />
        </SearchProvider>
      </body>
    </html>
  )
}
