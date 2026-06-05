import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// 🔥 Определяем serverURL из переменной окружения
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default buildConfig({
  serverURL,

  admin: {
    user: Users.slug,
  },

  collections: [Users, Articles, Media, SubSections, Sections, BestSelections, ContinueSelections],

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
  }),

  // 🔥 CORS для продакшена (если фронт на другом домене)
  cors: [
    serverURL,
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : '',
    'https://phuquoc.club', // Твой продакшен домен
  ].filter(Boolean),

  // 🔥 CSRF защита
  csrf: [
    serverURL,
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : '',
    'https://phuquoc.club',
  ].filter(Boolean),
})
