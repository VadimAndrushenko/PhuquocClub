import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'
import { simplifyRelationships } from '../utils/hooks'

const generateSubsectionHref: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (data?.section && data?.slug) {
    let sectionSlug = ''

    const sectionId = typeof data.section === 'object' && data.section !== null
      ? (data.section as { id: number | string }).id
      : data.section

    try {
      const section = await req.payload.findByID({
        collection: 'sections',
        id: sectionId,
        depth: 0,
      })
      sectionSlug = section?.slug || ''
    } catch {
      sectionSlug = ''
    }

    if (sectionSlug) {
      data.href = `/${sectionSlug}/${data.slug}`
    }
  }
  return data
}

export const SubSections: CollectionConfig = {
  slug: 'subsections',

  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },

  labels: {
    singular: 'Подраздел',
    plural: 'Подразделы',
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'section', 'category', 'status'],
    description: 'Подразделы внутри разделов. Например, в разделе "Когда ехать" подразделы "Сезоны" и "Погода". Содержат статьи.',
  },

  versions: {
    maxPerDoc: 10,
  },

  hooks: {
    beforeChange: [generateSubsectionHref],
    afterRead: [simplifyRelationships],
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
        description: 'Черновик — подраздел не виден на сайте.',
      },
      index: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Название подраздела',
      required: true,
      minLength: 3,
      maxLength: 200,
      localized: true,
      admin: {
        position: 'sidebar',
        description: 'Название подраздела. Например: "Сезоны", "Погода", "Еда", "Транспорт"',
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
        description: 'Часть URL подраздела. Только латиница и дефисы. Пример: seasons, weather',
      },
      index: true,
    },
    {
      name: 'section',
      type: 'relationship',
      relationTo: 'sections',
      label: '📁 Родительский раздел',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Выберите раздел, к которому относится подраздел.',
      },
      index: true,
    },
    {
      name: 'category',
      type: 'text',
      label: '🏷️ Категория',
      required: true,
      maxLength: 100,
      localized: true,
      admin: {
        position: 'sidebar',
        description: 'Категория подраздела. Используется для группировки статей. Например: "Погода", "Транспорт", "Проживание"',
      },
      index: true,
    },
    {
      name: 'href',
      type: 'text',
      label: '🔗 URL (авто)',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Генерируется автоматически из раздела и slug.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Краткое описание',
      required: true,
      minLength: 10,
      maxLength: 500,
      localized: true,
      admin: {
        rows: 3,
        description: 'Краткое описание подраздела для карточек и превью.',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Вступление',
      required: true,
      minLength: 20,
      maxLength: 2000,
      localized: true,
      admin: {
        rows: 5,
        description: 'Вступительный текст на странице подраздела, задающий контекст.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Обложка',
      required: true,
      admin: {
        description: 'Изображение для страницы подраздела.',
      },
    },
    {
      name: 'bestSelection',
      type: 'relationship',
      relationTo: 'bestSelections',
      label: '⭐ Подборка лучших статей',
      hasMany: false,
      admin: {
        description: 'Коллекция лучших статей для отображения на странице подраздела.',
      },
    },
    {
      name: 'continueSelection',
      type: 'relationship',
      relationTo: 'continueSelections',
      label: '📖 Продолжить чтение',
      hasMany: false,
      admin: {
        description: 'Коллекция статей для блока "Продолжить чтение".',
      },
    },
    {
      name: 'search',
      type: 'group',
      label: '🔍 Настройки поиска',
      admin: {
        description: 'Настройки поиска для страницы подраздела.',
      },
      fields: [
        {
          name: 'placeholder',
          type: 'text',
          label: 'Текст-подсказка',
          maxLength: 200,
          localized: true,
          admin: {
            description: 'Текст в поле поиска. Например: "Поиск по разделу..."',
          },
        },
        {
          name: 'tags',
          type: 'array',
          label: 'Теги для поиска',
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
