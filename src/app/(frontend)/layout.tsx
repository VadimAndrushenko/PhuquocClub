import type { Metadata } from 'next'
import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google'
import './globals.css'

import { cn } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

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
// Metadata
// ===============================
export const metadata: Metadata = {
  title: 'Фукуок.Гид',
  description: 'Полный гид по острову Фукуок — жильё, еда, транспорт, цены',
}

// ===============================
// Root Layout
// ===============================
export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        {/* Header */}
        <Header />

        {/* Main content */}
        <main className="relative flex-1">{children}</main>
        {/* Footer */}
        <Footer />
      </body>
    </html>
  )
}
