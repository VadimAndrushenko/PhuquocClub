import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'homePage',
  label: '🏠 Главная страница',

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

    // === HERO SECTION ===
    {
      name: 'heroSection',
      type: 'group',
      label: '🎯 Шапка главной (Hero)',
      admin: {
        description: 'Верхний блок главной страницы: заголовок, описание, фоновая картинка и поиск.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок',
          required: true,
          maxLength: 100,
          localized: true,
          defaultValue: 'Гид по Фукуоку',
          admin: {
            description: 'Главный заголовок на странице. Например: "Гид по Фукуоку"',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Описание',
          required: true,
          maxLength: 300,
          localized: true,
          admin: {
            rows: 3,
            description: 'Текст под заголовком. Например: "Всё что нужно туристу — быстро и понятно"',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Фоновое изображение',
          required: true,
          admin: {
            description: 'Большая фоновая картинка в шапке главной страницы.',
          },
        },
        {
          name: 'search',
          type: 'group',
          label: '🔍 Настройки поиска',
          admin: {
            description: 'Настройки строки поиска на главной странице.',
          },
          fields: [
            {
              name: 'placeholder',
              type: 'text',
              label: 'Текст-подсказка',
              maxLength: 200,
              localized: true,
              defaultValue: 'Поиск по сайту: пляжи, отели, еда, транспорт...',
              admin: {
                description: 'Серый текст внутри поля поиска.',
              },
            },
            {
              name: 'tags',
              type: 'array',
              label: 'Теги для быстрого поиска',
              maxRows: 10,
              localized: true,
              admin: {
                description: 'Популярные теги под строкой поиска для быстрой навигации.',
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
                    description: 'Текст тега. Например: "Пляжи", "Отели"',
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
      ],
    },

    // === POPULAR ARTICLES ===
    {
      name: 'popularArticles',
      type: 'relationship',
      relationTo: 'Articles',
      label: '🔥 Популярные статьи',
      hasMany: true,
      admin: {
        description: 'Выберите статьи для блока "Популярные" на главной странице.',
      },
    },

    // === PLANNING SECTION ===
    {
      name: 'planningBlock',
      type: 'group',
      label: '📋 Блок "Планируете поездку"',
      admin: {
        description: 'Статьи с иконками для блока планирования поездки на главной странице.',
      },
      fields: [
        {
          name: 'items',
          type: 'array',
          label: 'Статьи с иконками',
          admin: {
            description: 'Добавьте статьи с иконками для этого блока.',
          },
          fields: [
            {
              name: 'article',
              type: 'relationship',
              relationTo: 'Articles',
              label: 'Статья',
              required: true,
              admin: {
                description: 'Выберите статью.',
              },
            },
            {
              name: 'icon',
              type: 'select',
              label: 'Иконка',
              required: true,
              options: [
                { label: '☀️ Солнце', value: 'Sun' },
                { label: '📖 Книга', value: 'BookType' },
                { label: '💰 Кошелёк', value: 'Wallet' },
                { label: '🏠 Дом', value: 'House' },
                { label: '✈️ Самолёт', value: 'Plane' },
                { label: '🗺️ Карта', value: 'Map' },
                { label: '🌊 Волны', value: 'Waves' },
                { label: '🍴 Еда', value: 'Utensils' },
              ],
              admin: {
                description: 'Иконка, отображаемая рядом со статьёй.',
              },
            },
          ],
        },
      ],
    },

    // === COLLECTIONS ===
    {
      name: 'collections',
      type: 'relationship',
      relationTo: 'subsections',
      label: '📚 Подборки (подразделы)',
      hasMany: true,
      admin: {
        description: 'Выберите подразделы для отображения в блоке "Лучшие подборки" на главной.',
      },
    },

    // === URGENT SECTION ===
    {
      name: 'urgentBlock',
      type: 'group',
      label: '⚡ Блок "Срочно нужно"',
      admin: {
        description: 'Статьи с иконками для блока срочной информации на главной странице.',
      },
      fields: [
        {
          name: 'items',
          type: 'array',
          label: 'Статьи с иконками',
          admin: {
            description: 'Добавьте статьи с иконками для блока "Срочно нужно".',
          },
          fields: [
            {
              name: 'article',
              type: 'relationship',
              relationTo: 'Articles',
              label: 'Статья',
              required: true,
              admin: {
                description: 'Выберите статью.',
              },
            },
            {
              name: 'icon',
              type: 'select',
              label: 'Иконка',
              required: true,
              options: [
                { label: '☀️ Солнце', value: 'Sun' },
                { label: '📖 Книга', value: 'BookType' },
                { label: '💰 Кошелёк', value: 'Wallet' },
                { label: '🏠 Дом', value: 'House' },
                { label: '✈️ Самолёт', value: 'Plane' },
                { label: '🗺️ Карта', value: 'Map' },
                { label: '🌊 Волны', value: 'Waves' },
                { label: '🍴 Еда', value: 'Utensils' },
              ],
              admin: {
                description: 'Иконка, отображаемая рядом со статьёй.',
              },
            },
          ],
        },
      ],
    },

    // === SEO ===
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
