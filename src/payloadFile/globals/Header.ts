import type { GlobalConfig } from 'payload'
import { navigationIconOptions, linkTypeField, linkRelationshipFields } from '../utils/fields'

/**
 * ============================================
 * 📦 GLOBAL: Header Navigation
 * ============================================
 * Site-wide navigation menu
 */

export const Header: GlobalConfig = {
  slug: 'header',
  label: '📱 Header (Navigation)',

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
      label: 'Status',
      options: [
        { label: '📝 Draft', value: 'draft' },
        { label: '✅ Published', value: 'published' },
      ],
      defaultValue: 'published',
      required: true,
      admin: { position: 'sidebar' },
    },

    // === NAVIGATION ITEMS ===
    {
      name: 'navigationItems',
      type: 'array',
      label: '🧭 Navigation Menu',
      maxRows: 8,
      admin: {
        description: 'Add up to 8 navigation items. Links are generated automatically.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Menu Title',
          required: true,
          maxLength: 50,
          admin: {
            description: 'Text displayed in menu',
          },
        },
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          required: true,
          defaultValue: 'Map',
          options: navigationIconOptions,
        },
        linkTypeField,
        ...linkRelationshipFields,
      ],
    },
  ],
}