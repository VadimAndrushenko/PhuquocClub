import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // 🔥 ISR настройки
  experimental: {
    // Оптимизация для статических страниц
    optimizePackageImports: ['lucide-react', 'recharts'],
  },

  // 🔥 Кэширование и ISR
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, s-maxage=30, stale-while-revalidate=60',
        },
      ],
    },
  ],

  images: {
    remotePatterns: [
      new URL('http://localhost:3000/**'),
      new URL('https://phuquoc.club/**'),
      new URL('https://phuquoc-club.vercel.app/**'),
      new URL('https://**/*.vercel.app/**'),
      new URL('https://*.public.blob.vercel-storage.com/**'),
    ],
    // 🔥 Оптимизация изображений для статики
    unoptimized: process.env.NODE_ENV === 'development',
  },

  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
