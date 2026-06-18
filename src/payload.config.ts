import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './payloadFile/collections/Users'
import { Articles } from './payloadFile/collections/Articles'
import { Media } from './payloadFile/collections/Media'
import { SubSections } from './payloadFile/collections/SubSections'
import { Sections } from './payloadFile/collections/Sections'
import { BestSelections } from './payloadFile/collections/BestSelections'
import { ContinueSelections } from './payloadFile/collections/ContinueSelections'
import { CollectionsPage } from './payloadFile/globals/CollectionsPage'
import { HomePage } from './payloadFile/globals/HomePage'
import { Header } from './payloadFile/globals/Header'
import { Footer } from './payloadFile/globals/Footer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// 🔥 Определяем serverURL из переменной окружения
const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000')

// 🔥 Для Vercel Blob - правильный URL для медиа
const mediaURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default buildConfig({
  serverURL,

  admin: {
    user: Users.slug,
  },

  collections: [Users, Articles, Media, SubSections, Sections, BestSelections, ContinueSelections],

  globals: [CollectionsPage, HomePage, Header, Footer],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET!,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL!,
      max: 20,
      min: 5,
      idleTimeoutMillis: 300000,
      connectionTimeoutMillis: 10000,
    },
    push: true, // 🔥 Автоматическая синхронизация схемы (для разработки)
  }),

  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],

  // 🔥 CORS для продакшена
  cors: [
    serverURL,
    'http://localhost:3000',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
    'https://phuquoc-club.vercel.app',
    'https://phuquocclub.com',
    'https://www.phuquocclub.com',
  ].filter(Boolean),

  // 🔥 CSRF защита
  csrf: [
    serverURL,
    'http://localhost:3000',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
    'https://phuquoc-club.vercel.app',
    'https://phuquocclub.com',
    'https://www.phuquocclub.com',
  ].filter(Boolean),
})
