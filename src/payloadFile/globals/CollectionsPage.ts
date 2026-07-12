import type { GlobalConfig } from 'payload'

export const CollectionsPage: GlobalConfig = {
  slug: 'collectionsPage',
  label: '📚 Страница подборок',

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
      defaultValue: 'draft',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок страницы',
      required: true,
      maxLength: 100,
      localized: true,
      defaultValue: 'Все подборки',
      admin: {
        description: 'Заголовок страницы со всеми подборками.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание страницы',
      maxLength: 500,
      localized: true,
      admin: {
        rows: 3,
        description: 'Краткое описание страницы подборок.',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro-текст',
      localized: true,
      admin: {
        description: 'Вступительный текст под заголовком.',
        rows: 2,
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Обложка',
      required: true,
      admin: {
        description: 'Изображение для шапки страницы подборок.',
      },
    },
    {
      name: 'search',
      type: 'group',
      label: '🔍 Настройки поиска',
      admin: {
        description: 'Настройки строки поиска на странице подборок.',
      },
      fields: [
        {
          name: 'placeholder',
          type: 'text',
          label: 'Текст-подсказка',
          maxLength: 200,
          localized: true,
          admin: {
            description: 'Текст внутри поля поиска.',
          },
        },
        {
          name: 'tags',
          type: 'array',
          label: 'Теги для поиска',
          maxRows: 10,
          localized: true,
          admin: {
            description: 'Популярные теги под строкой поиска.',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Название тега',
              required: true,
              maxLength: 50,
              localized: true,
              admin: {
                description: 'Текст тега.',
              },
            },
            {
              name: 'icon',
              type: 'select',
              label: 'Иконка',
              required: true,
              options: [
                { label: '🍴 Еда', value: 'utensilsCrossed' },
                { label: '🗺️ Достопримечательности', value: 'map' },
                { label: '🏖️ Пляжи', value: 'waves' },
                { label: '🚌 Транспорт', value: 'bus' },
                { label: '💰 Цены', value: 'dollarSign' },
                { label: '📄 Виза', value: 'fileText' },
                { label: '🛟 Помощь', value: 'lifeBuoy' },
              ],
              admin: {
                description: 'Иконка рядом с тегом.',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'bestSelection',
      type: 'relationship',
      relationTo: 'bestSelections',
      label: '⭐ Лучшие статьи',
      hasMany: false,
      admin: {
        description: 'Подборка лучших статей для отображения вверху страницы.',
      },
    },
    {
      name: 'continueSelection',
      type: 'relationship',
      relationTo: 'continueSelections',
      label: '📖 Продолжить чтение',
      hasMany: false,
      admin: {
        description: 'Подборка статей для блока "Продолжить чтение".',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: '🔍 SEO и метаданные',
      admin: {
        description: 'Настройки для поисковых систем.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'SEO-заголовок',
          required: true,
          maxLength: 70,
          localized: true,
          admin: {
            description: 'Заголовок для поисковой выдачи (title). До 70 символов.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'SEO-описание',
          required: true,
          maxLength: 160,
          localized: true,
          admin: {
            rows: 3,
            description: 'Описание для поисковой выдачи (meta description). До 160 символов.',
          },
        },
        {
          name: 'keywords',
          type: 'array',
          label: 'Ключевые слова',
          maxRows: 10,
          localized: true,
          admin: {
            description: 'Ключевые слова для SEO.',
          },
          fields: [{
            name: 'keyword',
            type: 'text',
            label: 'Ключевое слово',
            maxLength: 50,
            localized: true,
            admin: {
              description: 'Одно ключевое слово или фраза.',
            },
          }],
        },
      ],
    },
  ],
}
