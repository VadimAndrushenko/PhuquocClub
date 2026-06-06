import type { Metadata } from 'next'
import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google'
import './globals.css'

import { cn } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SearchProvider } from '@/contexts/SearchContext'
import { getHeader, getFooter } from '@/lib/payload/payload'

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
// Root Layout
// ===============================

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Получаем навигацию из админки
  const headerData = await getHeader()
  const headerNavigationItems = (headerData as any)?._navigationItems || []

  // Получаем данные футера
  const footerData = await getFooter()
  const footerDescription = footerData?.description || undefined
  const footerSocialLinks = footerData?.socialLinks || undefined
  const footerNavigationSections = (footerData as any)?._sections || undefined
  const footerAdditionalLinks = (footerData as any)?._additionalLinks || undefined

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
        {/* Main content */}
        <SearchProvider>
          {/* Header */}
          <Header navigationItems={headerNavigationItems} />
          <main className="relative flex-1">{children}</main>
          {/* Footer */}
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
