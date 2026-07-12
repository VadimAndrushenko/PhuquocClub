import type { GlobalConfig } from 'payload'
import { navigationIconOptions, linkTypeField, linkRelationshipFields } from '../utils/fields'

export const Header: GlobalConfig = {
  slug: 'header',
  label: '📱 Шапка сайта (меню)',

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
      label: 'Статус',
      options: [
        { label: '📝 Черновик', value: 'draft' },
        { label: '✅ Опубликовано', value: 'published' },
      ],
      defaultValue: 'published',
      required: true,
      admin: { position: 'sidebar' },
    },

    // === NAVIGATION ITEMS ===
    {
      name: 'navigationItems',
      type: 'array',
      label: '🧭 Пункты меню',
      maxRows: 8,
      admin: {
        description: 'Кнопки в шапке сайта. Максимум 8 штук. Можно добавить раздел, подраздел, статью или внешнюю ссылку.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Текст кнопки',
          required: true,
          maxLength: 50,
          localized: true,
          admin: {
            description: 'Текст, который увидит пользователь в меню. Например: "Когда ехать", "На острове"',
          },
        },
        {
          name: 'icon',
          type: 'select',
          label: 'Иконка',
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
