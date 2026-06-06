import type { GlobalConfig } from 'payload'

// ============================================
// 🌐 ГЛОБАЛ: Страница "Подборки"
// ============================================
// Аналог Sections, но это отдельная страница со ВСЕМИ подборками.
// Здесь только настройки оформления страницы (Hero, поиск, SEO).
// Список подборок подтягивается автоматически из коллекции subsections.

export const CollectionsPage: GlobalConfig = {
  slug: 'collectionsPage',
  label: 'Страница «Подборки»',
  access: {
    read: () => true,
  },
  versions: {
    max: 10,
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      label: 'Статус публикации',
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
      defaultValue: 'Все подборки',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание страницы',
      admin: { rows: 3 },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Обложка страницы',
      required: true,
    },
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
    {
      name: 'bestSelection',
      type: 'relationship',
      relationTo: 'bestSelections',
      label: '⭐ Подборка лучших статей',
      hasMany: false,
      admin: {
        description: 'Опционально — лучшие статьи отобразятся вверху страницы.',
      },
    },
    {
      name: 'continueSelection',
      type: 'relationship',
      relationTo: 'continueSelections',
      label: '📖 Подборка «Продолжить чтение»',
      hasMany: false,
      admin: {
        description: 'Опционально — статьи отобразятся в блоке «Продолжить чтение».',
      },
    },
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
