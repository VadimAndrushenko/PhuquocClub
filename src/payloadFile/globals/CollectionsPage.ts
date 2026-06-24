import type { GlobalConfig } from 'payload'

/**
 * ============================================
 * 🌐 GLOBAL: Collections Page
 * ============================================
 * Settings for the collections overview page
 * Subsections list is fetched dynamically
 */

export const CollectionsPage: GlobalConfig = {
  slug: 'collectionsPage',
  label: '📚 Collections Page',

  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user,
  },

  versions: {
    max: 10,
  },

  fields: [
    {
      name: 'status',
      type: 'select',
      label: 'Publication Status',
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
      label: 'Page Title',
      required: true,
      maxLength: 100,
      defaultValue: 'Все подборки',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Page Description',
      maxLength: 500,
      admin: { rows: 3 },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover Image',
      required: true,
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
          maxRows: 10,
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
      name: 'bestSelection',
      type: 'relationship',
      relationTo: 'bestSelections',
      label: '⭐ Best Articles Collection',
      hasMany: false,
      admin: {
        description: 'Optional: display best articles at the top',
      },
    },
    {
      name: 'continueSelection',
      type: 'relationship',
      relationTo: 'continueSelections',
      label: '📖 Continue Reading Collection',
      hasMany: false,
      admin: {
        description: 'Optional: display in continue reading section',
      },
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