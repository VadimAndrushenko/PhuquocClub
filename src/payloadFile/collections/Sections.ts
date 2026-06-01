// collections/Sections.ts
import type { CollectionConfig } from 'payload'

export const Sections: CollectionConfig = {
  slug: 'sections',  // ← ВАЖНО: именно 'sections'
  labels: {
    singular: 'Раздел',
    plural: 'Разделы',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название раздела',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL-идентификатор',
      required: true,
      unique: true,
      admin: {
        description: 'Например: on-island, before-trip. Только латиница и дефисы.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание раздела',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Обложка раздела',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Черновик', value: 'draft' },
        { label: 'Опубликовано', value: 'published' },
      ],
      defaultValue: 'draft',
    },
  ],
}