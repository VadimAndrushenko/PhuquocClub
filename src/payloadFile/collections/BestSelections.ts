import type { CollectionConfig } from 'payload'

export const BestSelections: CollectionConfig = {
  slug: 'bestSelections',

  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },

  labels: {
    singular: 'Подборка лучших статей',
    plural: 'Подборки лучших статей',
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status'],
    description: 'Коллекции лучших/избранных статей. Отображаются в блоке "Лучшие подборки" на страницах разделов и подразделов.',
  },

  versions: {
    maxPerDoc: 10,
  },

  fields: [
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      options: [
        { label: '📝 Черновик', value: 'draft' },
        { label: '✅ Опубликовано', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Черновик — подборка не отображается на сайте.',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Название подборки',
      required: true,
      minLength: 3,
      maxLength: 200,
      admin: {
        description: 'Внутреннее название подборки для админки. Посетители его не видят.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL-идентификатор',
      unique: true,
      minLength: 2,
      maxLength: 200,
      admin: {
        description: 'Необязательный URL для прямого доступа к подборке.',
      },
    },
    {
      name: 'bestArticles',
      type: 'relationship',
      relationTo: 'Articles',
      label: '⭐ Избранные статьи',
      hasMany: true,
      required: true,
      minRows: 1,
      maxRows: 12,
      admin: {
        description: 'Выберите статьи для этой подборки. Можно добавить от 1 до 12 статей.',
      },
    },
  ],
}
