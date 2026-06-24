import type { CollectionConfig } from 'payload'

/**
 * ============================================
 * 📦 COLLECTION: Media
 * ============================================
 * Handles all image uploads
 */

export const Media: CollectionConfig = {
  slug: 'media',

  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },

  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },

  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 576,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
  },

  versions: {
    maxPerDoc: 10,
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      minLength: 3,
      maxLength: 200,
      admin: {
        description: 'Alternative text for accessibility and SEO',
      },
    },
  ],
}
