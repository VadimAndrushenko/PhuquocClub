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

// ===============================
// 🔥 ISR - РЕВАЛИДАЦИЯ КАЖДЫЕ 30 СЕКУНД
// ===============================
export const revalidate = 30
export const dynamic = 'force-static'

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
// Metadata (СТАТИЧНЫЕ)
// ===============================
export const metadata: Metadata = {
  title: 'Фукуок.Гид',
  description: 'Полный гид по острову Фукуок — жильё, еда, транспорт, цены',
}

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

function resolveLinkHref(link: ResolvableLink): string {
  switch (link.linkType) {
    case 'external':
      return link.externalUrl || '/'
    case 'section':
      if (link.section && typeof link.section === 'object') return `/${(link.section as Section).slug || ''}`
      return '/'
    case 'subsection': {
      const sub = link.subsection as Subsection | null | undefined
      if (sub) {
        const s = sub as any
        const sectionField = s.section
        const sectionSlug = typeof sectionField === 'object' && sectionField ? sectionField.slug || '' : String(sectionField || '')
        const subSlug = s.slug
        if (sectionSlug && subSlug) return `/${sectionSlug}/${subSlug}`
        const href = s.href
        if (href && !href.startsWith('/1/')) return href
        return subSlug ? `/${subSlug}` : '/'
      }
      return '/'
    }
    case 'article': {
      const art = link.article as Article | null | undefined
      if (art) {
        const a = art as any
        const sectionSlug = a.section
        const subField = a.subsection
        const subsectionSlug = typeof subField === 'object' && subField ? subField.slug || '' : String(subField || '')
        const artSlug = a.slug
        if (sectionSlug && subsectionSlug && artSlug) return `/${sectionSlug}/${subsectionSlug}/${artSlug}`
        const href = a.href
        if (href && !href.startsWith('/1/')) return href
        return artSlug ? `/${artSlug}` : '/'
      }
      return '/'
    }
    default:
      return '/'
  }
}

function headerToNavItems(header: HeaderPayload): NavigationItem[] {
  return (header.navigationItems || []).map((item) => ({
    id: item.id || '',
    title: item.title,
    href: resolveLinkHref(item),
    icon: item.icon,
    linkType: item.linkType,
  }))
}

function footerToNavSections(footer: FooterPayload): FooterNavSection[] {
  return (footer.sections || []).map((section) => ({
    title: section.sectionTitle,
    items: (section.links || []).map((link) => ({
      label: link.label,
      href: resolveLinkHref(link),
    })),
  }))
}

function footerToAdditionalLinks(footer: FooterPayload): AdditionalLink[] {
  return (footer.bottomLinks || []).map((link, idx) => ({
    id: link.id || idx + 1,
    title: link.title,
    href: resolveLinkHref(link),
  }))
}

// ===============================
// Root Layout
// ===============================

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerData = await getHeader()
  const footerData = await getFooter()

  const headerNavigationItems = headerData ? headerToNavItems(headerData) : []

  const footerDescription = footerData?.description || undefined
  const footerSocialLinks = footerData?.socialLinks || undefined
  const footerNavigationSections = footerData ? footerToNavSections(footerData) : undefined
  const footerAdditionalLinks = footerData ? footerToAdditionalLinks(footerData) : undefined

  return (
    <html
      lang="ru"
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        jetbrainsMono.variable,
      )}
    >
      <body className="min-h-screen flex flex-col bg-background text-main">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-[var(--color-main)] focus:text-white focus:rounded-xl focus:shadow-lg"
        >
          Перейти к содержанию
        </a>
        <SearchProvider>
          <Header navigationItems={headerNavigationItems} />
          <main id="main-content" className="relative flex-1">{children}</main>
          <Footer
            description={footerDescription}
            socialLinks={footerSocialLinks}
            navigationSections={footerNavigationSections}
            additionalLinks={footerAdditionalLinks}
          />
        </SearchProvider>
      </body>
    </html>
  )
}
