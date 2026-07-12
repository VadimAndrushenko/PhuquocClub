import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: '🦶 Подвал сайта',

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

    // === DESCRIPTION ===
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание сайта',
      maxLength: 500,
      admin: {
        rows: 4,
        description: 'Текст в подвале сайта. Краткое описание проекта.',
      },
      localized: true,
      defaultValue:
        'Практичный гид по жизни и отдыху на острове Фукуок.\nАктуальная информация, проверенные места и полезные\nсоветы для туристов и экспатов.',
    },

    // === SOCIAL LINKS ===
    {
      name: 'socialLinks',
      type: 'group',
      label: '🌐 Социальные сети',
      admin: {
        description: 'Ссылки на соцсети проекта. Отображаются в подвале сайта.',
      },
      fields: [
        {
          name: 'telegram',
          type: 'text',
          label: 'Telegram',
          defaultValue: 'https://t.me/phuquocclub',
          admin: {
            description: 'Полная ссылка на Telegram-канал.',
          },
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram',
          defaultValue: 'https://instagram.com',
          admin: {
            description: 'Полная ссылка на Instagram.',
          },
        },
        {
          name: 'youtube',
          type: 'text',
          label: 'YouTube',
          defaultValue: 'https://youtube.com/@phuquocclub',
          admin: {
            description: 'Полная ссылка на YouTube-канал.',
          },
        },
      ],
    },

    // === FOOTER SECTIONS ===
    {
      name: 'sections',
      type: 'array',
      label: '📑 Колонки подвала',
      maxRows: 4,
      admin: {
        description: 'Колонки со ссылками в подвале сайта. Каждая колонка имеет заголовок и список ссылок.',
      },
      fields: [
        {
          name: 'sectionTitle',
          type: 'text',
          label: 'Заголовок колонки',
          required: true,
          maxLength: 50,
          localized: true,
          admin: {
            description: 'Заголовок колонки. Например: "Разделы", "Информация"',
          },
        },
        {
          name: 'links',
          type: 'array',
          label: 'Ссылки',
          maxRows: 10,
          admin: {
            description: 'Ссылки внутри колонки.',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Текст ссылки',
              required: true,
              maxLength: 100,
              localized: true,
              admin: {
                description: 'Текст, который увидит пользователь.',
              },
            },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              required: true,
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подраздел', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя ссылка', value: 'external' },
              ],
              admin: {
                description: 'Выберите тип ссылки.',
              },
            },
            {
              name: 'section',
              type: 'relationship',
              relationTo: 'sections',
              label: 'Раздел',
              admin: {
                condition: (_, sibling) => sibling?.linkType === 'section',
                description: 'Выберите раздел сайта.',
              },
            },
            {
              name: 'subsection',
              type: 'relationship',
              relationTo: 'subsections',
              label: 'Подраздел',
              admin: {
                condition: (_, sibling) => sibling?.linkType === 'subsection',
                description: 'Выберите подраздел.',
              },
            },
            {
              name: 'article',
              type: 'relationship',
              relationTo: 'Articles',
              label: 'Статья',
              admin: {
                condition: (_, sibling) => sibling?.linkType === 'article',
                description: 'Выберите статью.',
              },
            },
            {
              name: 'externalUrl',
              type: 'text',
              label: 'Внешний URL',
              admin: {
                condition: (_, sibling) => sibling?.linkType === 'external',
                description: 'Полный URL. Например: https://example.com',
              },
            },
          ],
        },
      ],
    },

    // === ADDITIONAL LINKS (Bottom) ===
    {
      name: 'bottomLinks',
      type: 'array',
      label: '📄 Нижние ссылки',
      maxRows: 5,
      admin: {
        description: 'Маленькие ссылки в самом низу подвала (О проекте, Политика конфиденциальности и т.д.).',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Текст ссылки',
          required: true,
          maxLength: 100,
          localized: true,
          admin: {
            description: 'Текст ссылки. Например: "О проекте", "Конфиденциальность"',
          },
        },
        {
          name: 'linkType',
          type: 'select',
          label: 'Тип ссылки',
          required: true,
          options: [
            { label: '📁 Раздел', value: 'section' },
            { label: '📂 Подраздел', value: 'subsection' },
            { label: '📄 Статья', value: 'article' },
            { label: '🔗 Внешняя ссылка', value: 'external' },
          ],
          admin: {
            description: 'Выберите тип ссылки.',
          },
        },
        {
          name: 'section',
          type: 'relationship',
          relationTo: 'sections',
          label: 'Раздел',
          admin: {
            condition: (_, sibling) => sibling?.linkType === 'section',
            description: 'Выберите раздел сайта.',
          },
        },
        {
          name: 'subsection',
          type: 'relationship',
          relationTo: 'subsections',
          label: 'Подраздел',
          admin: {
            condition: (_, sibling) => sibling?.linkType === 'subsection',
            description: 'Выберите подраздел.',
          },
        },
        {
          name: 'article',
          type: 'relationship',
          relationTo: 'Articles',
          label: 'Статья',
          admin: {
            condition: (_, sibling) => sibling?.linkType === 'article',
            description: 'Выберите статью.',
          },
        },
        {
          name: 'externalUrl',
          type: 'text',
          label: 'Внешний URL',
          admin: {
            condition: (_, sibling) => sibling?.linkType === 'external',
            description: 'Полный URL. Например: https://example.com',
          },
        },
      ],
    },
  ],
}
