import type { CollectionConfig } from 'payload'
import { AppMedia, type BestArticleMinimal } from '@/shared/types'

// ============================================
// 🔧 ТИПЫ
// ============================================

interface BestSelectionDoc {
  id?: string | number
  title?: string
  slug?: string
  status?: 'draft' | 'published'
  bestArticles?: BestArticleMinimal[]
}

interface ContinueSelectionDoc {
  id?: string | number
  title?: string
  slug?: string
  status?: 'draft' | 'published'
  continuePlanning?: BestArticleMinimal[]
}

interface ContinueSelectionDoc {
  id?: string | number
  title?: string
  slug?: string
  status?: 'draft' | 'published'
}

interface SubsectionDoc {
  id?: string | number
  title?: string
  slug?: string
  section?: string | { slug?: string; title?: string }
  category?: string
  description?: string
  intro?: string
  image?: AppMedia | null
  href?: string
  sectionTitle?: string
  status?: 'draft' | 'published'
  bestSelection?: string | number | BestSelectionDoc | null
  continueSelection?: string | number | ContinueSelectionDoc | null
  updatedAt?: string
  createdAt?: string
}

// ============================================
// 🔧 ХУКИ
// ============================================

async function autoFillFromSection({ data, req }: any): Promise<void> {
  if (!data?.section) {
    data.category = ''
    data.sectionTitle = ''
    return
  }

  try {
    const sectionId =
      typeof data.section === 'object' && data.section !== null && 'id' in data.section
        ? (data.section as { id: string }).id
        : data.section

    const section = await req.payload.findByID({
      collection: 'sections',
      id: sectionId as string,
      depth: 0,
    })

    if (!section) return

    data.category = section.title || ''
    data.sectionTitle = section.title || ''
  } catch (error) {
    console.error('❌ Ошибка автозаполнения:', error)
  }
}

async function enrichSubsection({ doc, req }: { doc: any; req: any }): Promise<any> {
  if (!doc) return doc

  // 🔥 ЗАЩИТА ОТ РЕКУРСИИ: если этот вызов вложенный — пропускаем тяжёлый парсинг
  if (req?.context?.skipEnrich) {
    return doc
  }

  // 1. Упрощаем section в slug (как в Articles.ts)
  if (doc.section && typeof doc.section === 'object' && doc.section !== null) {
    if ('slug' in doc.section) {
      doc.section = doc.section.slug
    } else if ('id' in doc.section) {
      doc.section = doc.section.id
    }
  }

  // 2. Генерируем href
  const sectionSlug = typeof doc.section === 'string' ? doc.section : ''
  const subsectionSlug = typeof doc.slug === 'string' ? doc.slug : ''
  doc.href =
    sectionSlug && subsectionSlug ? `/${sectionSlug}/${subsectionSlug}` : `/${subsectionSlug}`

  return doc
}

// ============================================
// 📦 КОЛЛЕКЦИЯ
// ============================================

export const SubSections: CollectionConfig = {
  slug: 'subsections',
  access: {
    read: () => true,
  },
  labels: {
    singular: 'Подборка (подраздел)',
    plural: 'Подборки',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'section', 'status'],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 2000, // 2 секунды - автосохранение
      },
    },
    maxPerDoc: 50,
  },

  hooks: {
    beforeChange: [autoFillFromSection],
    beforeValidate: [autoFillFromSection],
    afterRead: [enrichSubsection],
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
      label: 'Название подборки',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL-идентификатор',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'section',
      type: 'relationship',
      relationTo: 'sections',
      label: '📁 Родительский раздел',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Выберите раздел — category заполнится автоматически.',
      },
    },
    {
      name: 'href',
      type: 'text',
      label: '🔗 Ссылка (авто)',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'text',
      label: '🏷️ Категория (авто)',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание подборки',
      required: true,
      admin: { rows: 3 },
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Вступление',
      required: true,
      admin: { rows: 5 },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Обложка подборки',
      required: true,
    },

    // === 🔥 ВЫБОР ПОДБОРКИ ИЗ BestSelections ===
    {
      name: 'bestSelection',
      type: 'relationship',
      relationTo: 'bestSelections',
      label: '⭐ Подборка лучших статей',
      hasMany: false,
      admin: {
        description: 'Выберите подборку — bestArticles заполнится автоматически',
      },
    },

    // === 🔗 ПРОДОЛЖИТЬ ЧИТАТЬ (как bestSelection) ===
    {
      name: 'continueSelection',
      type: 'relationship',
      relationTo: 'continueSelections',
      label: '📖 Подборка "Продолжить чтение"',
      hasMany: false,
      admin: {
        description: 'Выберите подборку — continuePlanning заполнится автоматически',
      },
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
