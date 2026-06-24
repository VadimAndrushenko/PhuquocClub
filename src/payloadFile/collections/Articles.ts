import type { CollectionConfig } from 'payload'
import { generateHrefBeforeSave, simplifyRelationships } from '../utils/hooks'

/**
 * ============================================
 * 📦 COLLECTION: Articles
 * ============================================
 * Optimized version with:
 * - Removed heavy afterRead hooks
 * - href generated in beforeChange (more efficient)
 * - Simplified relationships
 * - Better type safety
 */

/**
 * Auto-fill section and category from subsection
 */
const autoFillFromSubsection = async ({ data, req }: any) => {
  if (!data?.subsection) {
    data.section = ''
    data.category = ''
    return data
  }

  try {
    const subsectionId =
      typeof data.subsection === 'object' && 'id' in data.subsection
        ? data.subsection.id
        : data.subsection

    if (!subsectionId) return data

    const subsection = await req.payload.findByID({
      collection: 'subsections',
      id: subsectionId,
      depth: 0, // ✅ No deep nesting
    })

    if (!subsection) return data

    // Set category
    data.category = subsection.category || ''

    // Set section slug
    if (subsection.section) {
      if (typeof subsection.section === 'string') {
        data.section = subsection.section
      } else if (typeof subsection.section === 'object' && 'slug' in subsection.section) {
        data.section = subsection.section.slug || ''
      }
    }
  } catch (error) {
    console.error('❌ Error in autoFillFromSubsection:', error)
  }

  return data
}

export const Articles: CollectionConfig = {
  slug: 'Articles',
  
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subsection', 'category', 'status'],
    description: 'Manage articles for the website',
  },

  versions: {
    maxPerDoc: 50,
  },

  labels: {
    singular: 'Article',
    plural: 'Articles',
  },

  hooks: {
    beforeChange: [autoFillFromSubsection, generateHrefBeforeSave],
    beforeValidate: [autoFillFromSubsection],
    afterRead: [simplifyRelationships],
  },

  fields: [
    // === STATUS ===
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
      index: true, // ✅ Add index for performance
    },

    // === BASIC INFO ===
    {
      name: 'title',
      type: 'text',
      label: 'Article Title',
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
        description: 'Unique identifier for URL',
      },
      index: true, // ✅ Index for lookups
    },

    // === RELATIONSHIPS ===
    {
      name: 'subsection',
      type: 'relationship',
      relationTo: 'subsections',
      label: '📂 Subsection',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Section and category will be filled automatically',
      },
      index: true, // ✅ Index for filtering
    },
    {
      name: 'section',
      type: 'text',
      label: '📁 Section (auto)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Filled automatically from subsection',
      },
      index: true, // ✅ Index for filtering
    },
    {
      name: 'category',
      type: 'text',
      label: '🏷️ Category (auto)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Filled from subsection.category',
      },
      index: true, // ✅ Index for filtering
    },
    {
      name: 'href',
      type: 'text',
      label: '🔗 URL (auto)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Generated automatically',
      },
    },

    // === CONTENT ===
    {
      name: 'description',
      type: 'textarea',
      label: 'Short Description',
      required: true,
      minLength: 10,
      maxLength: 500,
      admin: {
        rows: 3,
        description: 'Brief summary for cards and previews',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Introduction',
      required: true,
      minLength: 20,
      maxLength: 2000,
      admin: {
        rows: 5,
        description: 'First text block that sets context',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover Image',
      required: true,
      admin: {
        description: 'Main image for cards, previews and SEO',
      },
    },
    {
      name: 'readTime',
      type: 'text',
      label: 'Read Time',
      required: true,
      admin: {
        description: 'Example: 5, 8, 12',
      },
    },
    {
      name: 'author',
      type: 'text',
      label: 'Author',
      required: true,
      defaultValue: 'Phuquoc.Club',
      maxLength: 100,
    },

    // === KRATKO SECTION ===
    {
      name: 'kratko_items',
      type: 'array',
      label: '📋 Quick Facts',
      admin: {
        description: 'Key facts and data',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: '💰 Money', value: 'DollarSign' },
            { label: '📄 Documents', value: 'FileText' },
            { label: '📍 Location', value: 'MapPin' },
            { label: '⚠️ Important', value: 'ShieldAlert' },
            { label: '⏰ Time', value: 'Clock' },
            { label: '👤 Person', value: 'User' },
          ],
        },
        { name: 'label', type: 'text', required: true, maxLength: 100 },
        { name: 'value', type: 'text', required: true, maxLength: 200 },
      ],
    },

    // === CONTENT BLOCKS ===
    {
      name: 'content_blocks',
      type: 'array',
      label: '📝 Content Blocks',
      admin: {
        description: 'Main content sections',
      },
      fields: [
        { name: 'title', type: 'text', required: true, maxLength: 200 },
        {
          name: 'description',
          type: 'richText',
          label: 'Main Text',
          required: true,
        },
        {
          name: 'contentType',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: '— None —', value: 'none' },
            { label: '📊 Table', value: 'table' },
            { label: '⚠️ Warning', value: 'warning' },
            { label: '✅ Checklist', value: 'checklist' },
            { label: '💡 Tip', value: 'tips' },
          ],
        },
        // TABLE
        {
          name: 'table',
          type: 'group',
          admin: {
            condition: (_, sibling) => sibling.contentType === 'table',
          },
          fields: [
            {
              name: 'headers',
              type: 'group',
              fields: [
                { name: 'header1', type: 'text', required: true },
                { name: 'header2', type: 'text', required: true },
                { name: 'header3', type: 'text', required: true },
              ],
            },
            {
              name: 'rows',
              type: 'array',
              fields: [
                { name: 'cell1', type: 'text', required: true },
                { name: 'cell2', type: 'text', required: true },
                { name: 'cell3', type: 'text', required: true },
              ],
            },
          ],
        },
        // WARNING
        {
          name: 'warning',
          type: 'textarea',
          admin: {
            condition: (_, sibling) => sibling.contentType === 'warning',
            rows: 4,
          },
        },
        // CHECKLIST
        {
          name: 'checklist',
          type: 'array',
          admin: {
            condition: (_, sibling) => sibling.contentType === 'checklist',
          },
          fields: [{ name: 'item', type: 'text', required: true }],
        },
        // TIPS
        {
          name: 'tips',
          type: 'textarea',
          admin: {
            condition: (_, sibling) => sibling.contentType === 'tips',
            rows: 4,
          },
        },
        // CONTINUATION TEXT
        {
          name: 'descriptionAfter',
          type: 'richText',
          label: 'Text After',
          admin: {
            condition: (_, sibling) => sibling.contentType !== 'none',
          },
        },
      ],
    },

    // === USEFUL LINKS ===
    {
      name: 'useful_links',
      type: 'array',
      label: '🔗 Useful Links',
      fields: [
        { name: 'href', type: 'text', required: true },
        { name: 'label', type: 'text', required: true, maxLength: 200 },
      ],
    },

    // === RELATED ARTICLES ===
    {
      name: 'related_articles',
      type: 'relationship',
      relationTo: 'Articles',
      label: '🔗 Related Articles',
      hasMany: true,
      maxRows: 6,
      admin: {
        description: 'Select articles to show in related section',
      },
    },

    // === SEO ===
    {
      name: 'seo',
      type: 'group',
      label: '🔍 SEO & Meta',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'SEO Title',
          required: true,
          maxLength: 70,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'SEO Description',
          required: true,
          maxLength: 160,
          admin: { rows: 3 },
        },
        {
          name: 'keywords',
          type: 'array',
          required: true,
          minRows: 1,
          maxRows: 10,
          fields: [{ name: 'keyword', type: 'text', required: true, maxLength: 50 }],
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          admin: {
            description: 'Check to prevent search engines from indexing',
          },
        },
      ],
    },
  ],
}