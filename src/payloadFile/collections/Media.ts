import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/*'],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 2000, // 2 секунды - автосохранение
      },
    },
    maxPerDoc: 50,
  },
  fields: [{ name: 'alt', type: 'text', required: true }],
}
