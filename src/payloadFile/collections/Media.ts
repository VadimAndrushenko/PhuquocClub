import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ['image/*'],
  },
  versions: {
    maxPerDoc: 10,
  },
  fields: [{ name: 'alt', type: 'text', required: true }],
}
