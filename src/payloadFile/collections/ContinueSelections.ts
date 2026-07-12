import type { CollectionConfig } from 'payload'

export const ContinueSelections: CollectionConfig = {
  slug: 'continueSelections',

  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },

  labels: {
    singular: 'Подборка "Продолжить чтение"',
    plural: 'Подборки "Продолжить чтение"',
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status'],
    description: 'Коллекции статей для блока "Продолжить чтение" / "Планируете поездку" на страницах разделов и подразделов.',
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
        description: 'Внутреннее название для админки.',
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
        description: 'Необязательный URL для прямого доступа.',
      },
    },
    {
      name: 'continuePlanning',
      type: 'relationship',
      relationTo: 'Articles',
      label: '🔗 Статьи для чтения',
      hasMany: true,
      required: true,
      minRows: 1,
      maxRows: 12,
      admin: {
        description: 'Выберите статьи для этой подборки. От 1 до 12 статей.',
      },
    },
  ],
}
