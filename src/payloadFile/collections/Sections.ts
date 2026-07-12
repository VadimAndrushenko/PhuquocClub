import type { CollectionConfig } from 'payload'

export const Sections: CollectionConfig = {
  slug: 'sections',

  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },

  labels: {
    singular: 'Раздел',
    plural: 'Разделы',
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status'],
    description: 'Основные разделы сайта. Например: "Когда ехать", "На острове". Каждый раздел содержит подразделы и статьи.',
  },

  versions: {
    maxPerDoc: 50,
  },

  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.slug) {
          data.href = `/${data.slug}`
        }
        return data
      },
    ],
  },

  fields: [
    {
      name: 'status',
      required: true,
      type: 'select',
      label: 'Статус',
      options: [
        { label: '📝 Черновик', value: 'draft' },
        { label: '✅ Опубликовано', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
        description: 'Черновик — раздел не виден на сайте. Опубликовано — раздел доступен.',
      },
      index: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Название раздела',
      required: true,
      minLength: 3,
      maxLength: 200,
      localized: true,
      admin: {
        position: 'sidebar',
        description: 'Название раздела. Отображается в меню, хлебных крошках и заголовках страниц. Например: "Когда ехать"',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL-идентификатор',
      required: true,
      unique: true,
      minLength: 2,
      maxLength: 200,
      admin: {
        position: 'sidebar',
        description: 'Часть URL раздела. Только латиница, дефисы. Пример: on-island, when-to-go',
      },
      index: true,
    },
    {
      name: 'href',
      type: 'text',
      label: 'URL раздела (авто)',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Генерируется автоматически из slug. Изменение вручную невозможно.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание раздела',
      maxLength: 500,
      localized: true,
      admin: {
        rows: 3,
        description: 'Краткое описание раздела для карточки на главной странице.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Обложка раздела',
      admin: {
        description: 'Изображение для карточки раздела на главной странице.',
      },
    },
    {
      name: 'bestSelection',
      type: 'relationship',
      relationTo: 'bestSelections',
      label: '⭐ Подборка лучших статей',
      hasMany: false,
      admin: {
        description: 'Выберите коллекцию лучших статей для отображения на странице раздела.',
      },
    },
    {
      name: 'continueSelection',
      type: 'relationship',
      relationTo: 'continueSelections',
      label: '📖 Продолжить чтение',
      hasMany: false,
      admin: {
        description: 'Выберите коллекцию статей для блока "Продолжить чтение".',
      },
    },
    {
      name: 'search',
      type: 'group',
      label: '🔍 Настройки поиска',
      admin: {
        description: 'Настройки поиска для страницы раздела.',
      },
      fields: [
        {
          name: 'placeholder',
          type: 'text',
          label: 'Текст-подсказка',
          maxLength: 200,
          localized: true,
          admin: {
            description: 'Текст, отображаемый в поле поиска. Например: "Поиск по разделу..."',
          },
        },
        {
          name: 'tags',
          type: 'array',
          label: 'Теги для быстрого поиска',
          localized: true,
          admin: {
            description: 'Популярные теги, отображаемые под строкой поиска для быстрой навигации.',
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
                description: 'Текст тега. Например: "Пляжи", "Отели", "Еда"',
              },
            },
            {
              name: 'icon',
              type: 'select',
              label: 'Иконка тега',
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
                description: 'Иконка, отображаемая рядом с тегом.',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: '🔍 SEO и метаданные',
      admin: {
        description: 'Настройки для поисковых систем. Заполняются отдельно для каждого языка.',
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
