// collections/Sections.ts
import type { CollectionConfig } from 'payload'

export const Sections: CollectionConfig = {
  slug: 'sections', // ← ВАЖНО: именно 'sections'
  access: {
    read: () => true,
  },
  labels: {
    singular: 'Раздел',
    plural: 'Разделы',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status'],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 2000, // 2 секунды - автосохранение
      },
    },
    maxPerDoc: 50,
  },
  fields: [
    {
      name: 'status',
      required: true,
      type: 'select',
      label: 'Статус публикации',
      options: [
        { label: '📝 Черновик', value: 'draft' },
        { label: '✅ Опубликовано', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Название раздела',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL-идентификатор',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
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

    // === 🔥 ВЫБОР ПОДБОРКИ ИЗ BestSelections ===
    {
      name: 'bestSelection',
      type: 'relationship',
      relationTo: 'bestSelections',
      label: '⭐ Подборка лучших статей',
      hasMany: false,
      admin: {
        description: 'Выберите подборку — лучшие статьи отобразятся на странице раздела',
      },
    },

    // === 🔗 ПРОДОЛЖИТЬ ЧИТАТЬ (как в subsections) ===
    {
      name: 'continueSelection',
      type: 'relationship',
      relationTo: 'continueSelections',
      label: '📖 Подборка "Продолжить чтение"',
      hasMany: false,
      admin: {
        description: 'Выберите подборку — статьи отобразятся в блоке "Продолжить чтение"',
      },
    },

    // === 🔍 НАСТРОЙКИ ПОИСКА ===
    {
      name: 'search',
      type: 'group',
      label: '🔍 Настройки поиска',
      fields: [
        {
          name: 'placeholder',
          type: 'text',
          label: 'Placeholder',
        },
        {
          name: 'tags',
          type: 'array',
          label: 'Теги',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Название тега',
              required: true,
            },
            {
              name: 'icon',
              type: 'select',
              label: 'Иконка',
              required: true,
              options: [
                { label: '🍴 Где поесть', value: 'utensilsCrossed' },
                { label: '🗺️ Что посмотреть', value: 'map' },
                { label: '🏖️ Пляжи', value: 'waves' },
                { label: '🚌 Транспорт', value: 'bus' },
                { label: '💰 Цены', value: 'dollarSign' },
                { label: '📄 Виза', value: 'fileText' },
                { label: '🛟 Помощь', value: 'lifeBuoy' },
              ],
            },
          ],
        },
      ],
    },

    // === 🔍 SEO И МЕТА-ТЕГИ ===
    {
      name: 'seo',
      type: 'group',
      label: '🔍 SEO и мета-теги',
      fields: [
        { name: 'title', type: 'text', label: 'SEO-заголовок', required: true },
        {
          name: 'description',
          type: 'textarea',
          label: 'SEO-описание',
          admin: { rows: 3 },
          required: true,
        },
        {
          name: 'keywords',
          type: 'array',
          fields: [{ name: 'keyword', type: 'text' }],
        },
      ],
    },
  ],
}
