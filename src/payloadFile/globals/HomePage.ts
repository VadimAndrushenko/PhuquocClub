import type { GlobalConfig } from 'payload'

/**
 * ============================================
 * 🌐 GLOBAL: Home Page
 * ============================================
 * Optimized: Removed unused hooks
 * Data fetching handled on frontend for better performance
 */

export const HomePage: GlobalConfig = {
  slug: 'homePage',
  label: '🏠 Home Page',

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

    // === HERO SECTION ===
    {
      name: 'heroSection',
      type: 'group',
      label: '🎯 Hero Section',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
          maxLength: 100,
          defaultValue: 'Гид по Фукуоку',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true,
          maxLength: 300,
          admin: { rows: 3 },
          defaultValue: 'Всё что нужно туристу - быстро и понятно',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Hero Image',
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
              defaultValue: 'Поиск по сайту: пляжи, отели, еда, транспорт...',
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
      ],
    },

    // === POPULAR ARTICLES ===
    {
      name: 'popularArticles',
      type: 'relationship',
      relationTo: 'Articles',
      label: '🔥 Popular Articles',
      hasMany: true,
      maxRows: 3,
      admin: {
        description: 'Select 3 articles for Popular section',
      },
    },

    // === PLANNING SECTION ===
    {
      name: 'planningBlock',
      type: 'group',
      label: '📋 Planning Section',
      fields: [
        {
          name: 'articles',
          type: 'relationship',
          relationTo: 'Articles',
          label: 'Articles',
          hasMany: true,
          maxRows: 4,
          admin: {
            description: 'Select 4 articles for Planning section',
          },
        },
        {
          name: 'icons',
          type: 'array',
          label: 'Icons (same order as articles)',
          maxRows: 4,
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Icon',
              required: true,
              options: [
                { label: '☀️ Sun', value: 'Sun' },
                { label: '📖 Book', value: 'BookType' },
                { label: '💰 Wallet', value: 'Wallet' },
                { label: '🏠 House', value: 'House' },
                { label: '✈️ Plane', value: 'Plane' },
                { label: '🗺️ Map', value: 'Map' },
                { label: '🌊 Waves', value: 'Waves' },
                { label: '🍴 Food', value: 'Utensils' },
              ],
            },
          ],
        },
      ],
    },

    // === COLLECTIONS ===
    {
      name: 'collections',
      type: 'relationship',
      relationTo: 'subsections',
      label: '📚 Collections (Subsections)',
      hasMany: true,
      maxRows: 12,
      admin: {
        description: 'Select subsections to display',
      },
    },

    // === URGENT SECTION ===
    {
      name: 'urgentBlock',
      type: 'group',
      label: '⚡ Urgent Section',
      fields: [
        {
          name: 'articles',
          type: 'relationship',
          relationTo: 'Articles',
          label: 'Articles',
          hasMany: true,
          maxRows: 4,
          admin: {
            description: 'Select 4 articles for Urgent section',
          },
        },
        {
          name: 'icons',
          type: 'array',
          label: 'Icons (same order as articles)',
          maxRows: 4,
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Icon',
              required: true,
              options: [
                { label: '☀️ Sun', value: 'Sun' },
                { label: '📖 Book', value: 'BookType' },
                { label: '💰 Wallet', value: 'Wallet' },
                { label: '🏠 House', value: 'House' },
                { label: '✈️ Plane', value: 'Plane' },
                { label: '🗺️ Map', value: 'Map' },
                { label: '🌊 Waves', value: 'Waves' },
                { label: '🍴 Food', value: 'Utensils' },
              ],
            },
          ],
        },
      ],
    },

    // === SEO ===
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