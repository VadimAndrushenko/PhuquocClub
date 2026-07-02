import type { Metadata } from 'next'
import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google'
import './globals.css'

import { cn } from '@/lib/utils'
import { Header, type NavigationItem } from '@/components/layout/header'
import { Footer, type FooterNavSection, type AdditionalLink } from '@/components/layout/footer'
import { SearchProvider } from '@/contexts/SearchContext'
import { getHeader, getFooter } from '@/lib/payload/globals'
import type { Footer as FooterPayload, Header as HeaderPayload } from '@/payload-types'

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

function resolveLinkHref(link: { linkType: string; section?: unknown; subsection?: unknown; article?: unknown; externalUrl?: string | null }): string {
  switch (link.linkType) {
    case 'external':
      return link.externalUrl || '/'
    case 'section': {
      const s = link.section as { slug?: string } | null | undefined
      return s?.slug ? `/${s.slug}` : '/'
    }
    case 'subsection': {
      const s = link.subsection as { href?: string; slug?: string } | null | undefined
      return s?.href || (s?.slug ? `/${s.slug}` : '/')
    }
    case 'article': {
      const a = link.article as { href?: string } | null | undefined
      return a?.href || '/'
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
        <SearchProvider>
          <Header navigationItems={headerNavigationItems} />
          <main className="relative flex-1">{children}</main>
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
