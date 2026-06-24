/**
 * ============================================
 * 🔧 REUSABLE FIELD DEFINITIONS
 * ============================================
 * Commonly used field configurations to avoid duplication
 */

import type { Field } from 'payload'

/**
 * Link type field for navigation items
 */
export const linkTypeField: Field = {
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
}

/**
 * Relationship fields for link types
 */
export const linkRelationshipFields: Field[] = [
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
      description: 'Example: https://example.com',
    },
  },
]

/**
 * Create a link field group with label
 */
export function createLinkField(name: string, label: string, defaultLabel?: string): Field {
  return {
    name,
    type: 'group',
    label,
    fields: [
      {
        name: 'label',
        type: 'text',
        label: 'Display Text',
        required: true,
        maxLength: 100,
        defaultValue: defaultLabel,
      },
      linkTypeField,
      ...linkRelationshipFields,
    ],
  }
}

/**
 * Icon options for navigation
 */
export const navigationIconOptions = [
  { label: '🗺️ Map', value: 'Map' },
  { label: '✈️ Plane', value: 'Plane' },
  { label: '🏨 Hotel', value: 'Hotel' },
  { label: '🍴 Food', value: 'UtensilsCrossed' },
  { label: '📍 Location', value: 'MapPin' },
  { label: '🚗 Car', value: 'Car' },
  { label: '💰 Money', value: 'DollarSign' },
  { label: '💡 Tips', value: 'Lightbulb' },
  { label: '🛟 Help', value: 'LifeBuoy' },
  { label: '📋 List', value: 'List' },
  { label: '⭐ Star', value: 'Star' },
  { label: '📅 Calendar', value: 'Calendar' },
  { label: '🌊 Waves', value: 'Waves' },
  { label: '🌴 Palm', value: 'Palmtree' },
  { label: '📸 Camera', value: 'Camera' },
  { label: '🎒 Backpack', value: 'Backpack' },
]