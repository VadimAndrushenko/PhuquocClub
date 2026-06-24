import type { CollectionConfig } from 'payload'

/**
 * ============================================
 * 📦 COLLECTION: BestSelections
 * ============================================
 * Optimized: No heavy afterRead hooks
 * Articles are fetched efficiently on the frontend
 */

export const BestSelections: CollectionConfig = {
  slug: 'bestSelections',

  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },

  labels: {
    singular: 'Best Articles Collection',
    plural: 'Best Articles Collections',
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status'],
    description: 'Collections of best/featured articles',
  },

  versions: {
    maxPerDoc: 10,
  },

  fields: [
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: '📝 Draft', value: 'draft' },
        { label: '✅ Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Collection Name',
      required: true,
      minLength: 3,
      maxLength: 200,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL Slug',
      unique: true,
      minLength: 2,
      maxLength: 200,
      admin: {
        description: 'Optional: for direct URL access',
      },
    },
    {
      name: 'bestArticles',
      type: 'relationship',
      relationTo: 'Articles',
      label: '⭐ Featured Articles',
      hasMany: true,
      required: true,
      minRows: 1,
      maxRows: 12,
      admin: {
        description: 'Select articles for this collection. IDs stored in DB, data fetched on frontend.',
      },
    },
  ],
}
