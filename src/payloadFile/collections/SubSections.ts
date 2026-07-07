import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'
import { simplifyRelationships } from '../utils/hooks'

/**
 * ============================================
 * 📦 COLLECTION: Subsections
 * ============================================
 * Optimized with simplified hooks
 */

const generateSubsectionHref: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (data?.section && data?.slug) {
    let sectionSlug = ''

    const sectionId = typeof data.section === 'object' && data.section !== null
      ? (data.section as { id: number | string }).id
      : data.section

    try {
      const section = await req.payload.findByID({
        collection: 'sections',
        id: sectionId,
        depth: 0,
      })
      sectionSlug = section?.slug || ''
    } catch {
      sectionSlug = ''
    }

    if (sectionSlug) {
      data.href = `/${sectionSlug}/${data.slug}`
    }
  }
  return data
}

export const SubSections: CollectionConfig = {
  slug: 'subsections',

  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },

  labels: {
    singular: 'Subsection',
    plural: 'Subsections',
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'section', 'category', 'status'],
  },

  versions: {
    maxPerDoc: 10,
  },

  hooks: {
    beforeChange: [generateSubsectionHref],
    afterRead: [simplifyRelationships],
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
      index: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Subsection Title',
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
      admin: { position: 'sidebar' },
      index: true,
    },
    {
      name: 'section',
      type: 'relationship',
      relationTo: 'sections',
      label: '📁 Parent Section',
      required: true,
      admin: {
        position: 'sidebar',
      },
      index: true,
    },
    {
      name: 'category',
      type: 'text',
      label: '🏷️ Category',
      required: true,
      maxLength: 100,
      admin: {
        position: 'sidebar',
      },
      index: true,
    },
    {
      name: 'href',
      type: 'text',
      label: '🔗 URL (auto)',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
      minLength: 10,
      maxLength: 500,
      admin: { rows: 3 },
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Introduction',
      required: true,
      minLength: 20,
      maxLength: 2000,
      admin: { rows: 5 },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover Image',
      required: true,
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