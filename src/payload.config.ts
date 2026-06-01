// src/payload.config.ts
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './payloadFile/collections/Users'
import { Articles } from './payloadFile/collections/Articles'
import { Media } from './payloadFile/collections/Media'
import { SubSections } from './payloadFile/collections/SubSections'
import { Sections } from './payloadFile/collections/Sections'



const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Articles,  // ← Проверь, что здесь есть
    Media,
    SubSections,
    Sections,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET!,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),  // ← Путь к типам
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL!,
    },
  }),
})