import type { CollectionConfig } from 'payload'

/**
 * ============================================
 * 📦 COLLECTION: Sections
 * ============================================
 * Clean and optimized
 */

export const Sections: CollectionConfig = {
  slug: 'sections',

  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },

  labels: {
    singular: 'Section',
    plural: 'Sections',
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status'],
  },

  versions: {
    maxPerDoc: 50,
  },

  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.slug) {
          data.href = `/${data.slug}`
        }
        return data
      },
    ],
  },

  fields: [
    {
      name: 'status',
      required: true,
      type: 'select',
      label: 'Publication Status',
      options: [
        { label: '📝 Draft', value: 'draft' },
        { label: '✅ Published', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
      index: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      required: true,
      minLength: 3,
      maxLength: 200,
      admin: { position: 'sidebar' },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL Slug',
      required: true,
      unique: true,
      minLength: 2,
      maxLength: 200,
      admin: {
        position: 'sidebar',
        description: 'Example: on-island, before-trip',
      },
      index: true,
    },
    {
      name: 'href',
      type: 'text',
      label: 'URL (auto)',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      maxLength: 500,
      admin: { rows: 3 },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Cover Image',
    },
    {
      name: 'bestSelection',
      type: 'relationship',
      relationTo: 'bestSelections',
      label: '⭐ Best Articles Collection',
      hasMany: false,
    },
    {
      name: 'continueSelection',
      type: 'relationship',
      relationTo: 'continueSelections',
      label: '📖 Continue Reading Collection',
      hasMany: false,
    },
    {
      name: 'search',
      type: 'group',
      label: '🔍 Search Settings',
      fields: [
        {
          name: 'placeholder',
          type: 'text',
          label: 'Placeholder',
          maxLength: 200,
        },
        {
          name: 'tags',
          type: 'array',
          label: 'Tags',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Tag Name',
              required: true,
              maxLength: 50,
            },
            {
              name: 'icon',
              type: 'select',
              label: 'Icon',
              required: true,
              options: [
                { label: '🍴 Food', value: 'utensilsCrossed' },
                { label: '🗺️ Attractions', value: 'map' },
                { label: '🏖️ Beaches', value: 'waves' },
                { label: '🚌 Transport', value: 'bus' },
                { label: '💰 Prices', value: 'dollarSign' },
                { label: '📄 Visa', value: 'fileText' },
                { label: '🛟 Help', value: 'lifeBuoy' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: '🔍 SEO & Meta',
      fields: [
        { name: 'title', type: 'text', label: 'SEO Title', required: true, maxLength: 70 },
        {
          name: 'description',
          type: 'textarea',
          label: 'SEO Description',
          admin: { rows: 3 },
          required: true,
          maxLength: 160,
        },
        {
          name: 'keywords',
          type: 'array',
          maxRows: 10,
          fields: [{ name: 'keyword', type: 'text', maxLength: 50 }],
        },
      ],
    },
  ],
}