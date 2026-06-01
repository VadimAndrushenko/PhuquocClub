// collections/Subsections.ts
import type { CollectionConfig } from 'payload'

export const SubSections: CollectionConfig = {
  slug: 'subsections',
  labels: {
    singular: 'Подборка (подраздел)',
    plural: 'Подборки',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'section', 'status'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название подборки',
      required: true,
      admin: { description: 'Например: "Транспорт", "Лучшие пляжи"' },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL-идентификатор',
      required: true,
      unique: true,
      admin: { 
        description: 'Например: transport, beaches, restaurants. Только латиница и дефисы.' 
      },
    },
    {
      name: 'section',
      type: 'relationship',
      relationTo: 'sections',
      label: 'Родительский раздел',
      required: true,
      admin: { description: 'В каком разделе сайта отображается эта подборка' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание подборки',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Обложка подборки',
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