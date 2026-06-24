import type { GlobalConfig } from 'payload'
import { createLinkField } from '../utils/fields'

/**
 * ============================================
 * 📦 GLOBAL: Footer
 * ============================================
 * Site-wide footer configuration
 * Optimized: Using reusable field utilities
 */

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: '🦶 Footer',

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

    // === DESCRIPTION ===
    {
      name: 'description',
      type: 'textarea',
      label: 'Site Description',
      maxLength: 500,
      admin: {
        rows: 4,
        description: 'Description text in footer',
      },
      defaultValue:
        'Практичный гид по жизни и отдыху на острове Фукуок.\nАктуальная информация, проверенные места и полезные\nсоветы для туристов и экспатов.',
    },

    // === SOCIAL LINKS ===
    {
      name: 'socialLinks',
      type: 'group',
      label: '🌐 Social Media',
      fields: [
        {
          name: 'telegram',
          type: 'text',
          label: 'Telegram',
          defaultValue: 'https://t.me/phuquocclub',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram',
          defaultValue: 'https://instagram.com',
        },
        {
          name: 'youtube',
          type: 'text',
          label: 'YouTube',
          defaultValue: 'https://youtube.com/@phuquocclub',
        },
      ],
    },

    // === FOOTER SECTIONS ===
    {
      name: 'sections',
      type: 'array',
      label: '📑 Footer Sections',
      maxRows: 6,
      admin: {
        description: 'Create footer sections with links',
      },
      fields: [
        {
          name: 'sectionTitle',
          type: 'text',
          label: 'Section Title',
          required: true,
          maxLength: 50,
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          maxRows: 10,
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Link Text',
              required: true,
              maxLength: 100,
            },
            {
              name: 'linkType',
              type: 'select',
              label: 'Link Type',
              required: true,
              options: [
                { label: '📁 Section', value: 'section' },
                { label: '📂 Subsection', value: 'subsection' },
                { label: '📄 Article', value: 'article' },
                { label: '🔗 External', value: 'external' },
              ],
            },
            {
              name: 'section',
              type: 'relationship',
              relationTo: 'sections',
              label: 'Section',
              admin: {
                condition: (_, sibling) => sibling?.linkType === 'section',
              },
            },
            {
              name: 'subsection',
              type: 'relationship',
              relationTo: 'subsections',
              label: 'Subsection',
              admin: {
                condition: (_, sibling) => sibling?.linkType === 'subsection',
              },
            },
            {
              name: 'article',
              type: 'relationship',
              relationTo: 'Articles',
              label: 'Article',
              admin: {
                condition: (_, sibling) => sibling?.linkType === 'article',
              },
            },
            {
              name: 'externalUrl',
              type: 'text',
              label: 'External URL',
              admin: {
                condition: (_, sibling) => sibling?.linkType === 'external',
              },
            },
          ],
        },
      ],
    },

    // === ADDITIONAL LINKS (Bottom) ===
    {
      name: 'bottomLinks',
      type: 'array',
      label: '📄 Bottom Links',
      maxRows: 5,
      admin: {
        description: 'Small links at the bottom (About, Privacy Policy, etc.)',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Link Text',
          required: true,
          maxLength: 100,
        },
        {
          name: 'linkType',
          type: 'select',
          label: 'Link Type',
          required: true,
          options: [
            { label: '📁 Section', value: 'section' },
            { label: '📂 Subsection', value: 'subsection' },
            { label: '📄 Article', value: 'article' },
            { label: '🔗 External', value: 'external' },
          ],
        },
        {
          name: 'section',
          type: 'relationship',
          relationTo: 'sections',
          label: 'Section',
          admin: {
            condition: (_, sibling) => sibling?.linkType === 'section',
          },
        },
        {
          name: 'subsection',
          type: 'relationship',
          relationTo: 'subsections',
          label: 'Subsection',
          admin: {
            condition: (_, sibling) => sibling?.linkType === 'subsection',
          },
        },
        {
          name: 'article',
          type: 'relationship',
          relationTo: 'Articles',
          label: 'Article',
          admin: {
            condition: (_, sibling) => sibling?.linkType === 'article',
          },
        },
        {
          name: 'externalUrl',
          type: 'text',
          label: 'External URL',
          admin: {
            condition: (_, sibling) => sibling?.linkType === 'external',
          },
        },
      ],
    },
  ],
}