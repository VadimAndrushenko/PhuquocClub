import type { CollectionConfig, Where } from 'payload'
import type { Media } from '../../payload-types'
import type { AppMedia } from '@/shared/types'
import { RelatedArticle } from '@/shared/types/pageType/article.type'

// ============================================
// 🔧 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

/** Генерирует href из section/subsection/slug */
function generateHref(section: string, subsection: string, slug: string): string {
  if (!slug) return '/'

  if (section && subsection) {
    return `/${section}/${subsection}/${slug}`
  }
  return `/${slug}`
}

// ============================================
// 🪝 ХУКИ
// ============================================

export const autoFillFromSubsection = async ({ data, req }: any) => {
  if (!data?.subsection) {
    data.section = ''
    data.category = ''
    return
  }

  try {
    const subsectionId =
      typeof data.subsection === 'object' && data.subsection !== null && 'id' in data.subsection
        ? (data.subsection as { id: number }).id
        : (data.subsection as number)

    if (!subsectionId) return

    // 🔥 Загружаем subsection с depth: 1 чтобы получить section
    const subsection = await req.payload.findByID({
      collection: 'subsections',
      id: subsectionId,
      depth: 1,
    })

    if (!subsection) return

    data.category = (subsection as { title?: string }).title || ''

    // 🔥 Получаем section из subsection
    const sectionField = (subsection as { section?: unknown }).section
    if (sectionField) {
      // Если section уже строка (slug) — используем её
      if (typeof sectionField === 'string') {
        data.section = sectionField
      }
      // Если section объект — берём slug
      else if (
        typeof sectionField === 'object' &&
        sectionField !== null &&
        'slug' in sectionField
      ) {
        data.section = (sectionField as { slug?: string }).slug || ''
      }
    }
  } catch (error) {
    console.error('❌ Ошибка автозаполнения:', error)
  }
}

/**
 * 🔥 ГЛАВНЫЙ ХУК: генерирует href для статьи и всех связанных статей
 * + упрощает subsection в slug
 * + преобразует image в полный объект медиа
 * + подгружает и преобразует related_articles в массив объектов для API
 */
export const enrichWithHref = async ({ doc, req }: any) => {
  if (!doc) return doc

  // 🔥 ЗАЩИТА ОТ РЕКУРСИИ: если вызов вложенный — пропускаем тяжёлый парсинг related_articles
  if (req?.context?.skipEnrich) {
    return doc
  }

  // 🔥 1. СНАЧАЛА упрощаем subsection в slug (строку)
  if (doc.subsection && typeof doc.subsection === 'object' && doc.subsection !== null) {
    if ('slug' in doc.subsection) {
      doc.subsection = doc.subsection.slug
    } else if ('id' in doc.subsection) {
      doc.subsection = doc.subsection.id
    }
  }

  // 🔥 2. ТЕПЕРЬ генерируем href (subsection уже строка!)
  let sectionSlug = typeof doc.section === 'string' ? doc.section : ''
  const subsectionSlug = typeof doc.subsection === 'string' ? doc.subsection : ''

  // 🔥 Если section пустой — пробуем загрузить из subsection
  if (!sectionSlug && subsectionSlug) {
    try {
      const subsectionResult = await req.payload.find({
        collection: 'subsections',
        where: { slug: { equals: subsectionSlug } },
        depth: 0,
        limit: 1,
      })
      if (subsectionResult.docs && subsectionResult.docs.length > 0) {
        const subDoc = subsectionResult.docs[0] as any
        sectionSlug = typeof subDoc.section === 'string' ? subDoc.section : ''
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки section:', error)
    }
  }

  doc.href = generateHref(sectionSlug, subsectionSlug, doc.slug || '')

  // 3. Преобразуем image в полный объект медиа
  if (doc.image && typeof doc.image === 'object' && doc.image !== null) {
    doc.image = {
      id: doc.image.id,
      url: doc.image.url,
      thumbnailURL: doc.image.thumbnailURL,
      filename: doc.image.filename,
      mimeType: doc.image.mimeType,
      width: doc.image.width,
      height: doc.image.height,
      alt: doc.image.alt,
    } as AppMedia
  }

  // 4. Подгружаем и преобразуем related_articles
  if (
    doc.related_articles &&
    Array.isArray(doc.related_articles) &&
    doc.related_articles.length > 0
  ) {
    const result: RelatedArticle[] = []

    for (const articleRef of doc.related_articles) {
      try {
        // Если это ID — загружаем статью
        let article: any = articleRef
        if (typeof articleRef === 'string' || typeof articleRef === 'number') {
          // 🔥 skipEnrich — НЕ триггерим хуки повторно (избегаем рекурсии)
          article = await req.payload.findByID({
            collection: 'Articles',
            id: articleRef,
            depth: 2,
            context: { skipEnrich: true },
          })
        }

        if (!article) continue

        // Для связанных статей тоже сначала упрощаем subsection
        let artSubsection = ''
        if (typeof article.subsection === 'string') {
          artSubsection = article.subsection
        } else if (
          article.subsection &&
          typeof article.subsection === 'object' &&
          'slug' in article.subsection
        ) {
          artSubsection = (article.subsection as { slug: string }).slug || ''
        }

        const artSection = typeof article.section === 'string' ? article.section : ''
        const artHref = generateHref(artSection, artSubsection, article.slug || '')

        let artImage: AppMedia = { id: article.image as number }
        if (article.image && typeof article.image === 'object') {
          const img = article.image as Media
          artImage = {
            id: img.id,
            url: img.url,
            thumbnailURL: img.thumbnailURL,
            filename: img.filename,
            mimeType: img.mimeType,
            width: img.width,
            height: img.height,
            alt: img.alt,
          }
        }

        result.push({
          id: article.id,
          category: article.category || '',
          title: article.title,
          description: article.description || '',
          image: artImage,
          href: artHref,
          readTime: article.readTime,
        })
      } catch (error) {
        console.error('❌ Ошибка загрузки related article:', error)
      }
    }

    doc.related_articles = result
  }

  return doc
}

// ============================================
// 📦 КОЛЛЕКЦИЯ
// ============================================

export const Articles: CollectionConfig = {
  slug: 'Articles',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subsection', 'section', 'category', 'status'],
    description: 'Статьи для сайта — управляйте контентом здесь',
  },
  versions: {
    drafts: {
      autosave: {
        interval: 2000, // 2 секунды - автосохранение
      },
    },
    maxPerDoc: 50,
  },
  labels: { singular: 'Статья', plural: 'Статьи' },

  hooks: {
    beforeChange: [autoFillFromSubsection],
    beforeValidate: [autoFillFromSubsection],
    afterRead: [enrichWithHref], // 🔥 Один хук делает всё
  },

  fields: [
    // === 🟢 СТАТУС ===
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

    // === 📌 ОСНОВНАЯ ИНФОРМАЦИЯ ===
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок статьи',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL-адрес (slug)',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },

    // === 📂 ПОДБОРКА ===
    {
      name: 'subsection',
      type: 'relationship',
      relationTo: 'subsections',
      label: '📂 Подборка (подраздел)',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Выберите подборку — раздел и категория заполнятся автоматически.',
      },
    },
    {
      name: 'section',
      type: 'text',
      label: '📁 Раздел сайта (авто)',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'category',
      type: 'text',
      label: '🏷️ Категория (авто)',
      admin: { readOnly: true, position: 'sidebar' },
    },

    // === 🔥 ВИРТУАЛЬНОЕ ПОЛЕ href (только для чтения, заполняется хуком) ===
    {
      name: 'href',
      type: 'text',
      label: '🔗 Ссылка на статью (авто)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Генерируется автоматически из раздела, подборки и slug.',
      },
    },

    // === ✍️ ТЕКСТ ===
    {
      name: 'description',
      type: 'textarea',
      label: 'Короткое описание',
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

    // === 🖼️ МЕДИА ===
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Обложка статьи',
      required: true,
    },

    // === ⏱️ МЕТА ===
    {
      name: 'readTime',
      type: 'text',
      label: 'Время чтения',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      label: 'Автор',
      required: true,
      defaultValue: 'Phuquoc.Club',
    },

    // === 📋 БЛОК КРАТКО ===
    {
      name: 'kratko_items',
      type: 'array',
      label: '📋 Блок "Кратко"',
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: '💰 Деньги', value: 'DollarSign' },
            { label: '📄 Документы', value: 'FileText' },
            { label: '📍 Местоположение', value: 'MapPin' },
            { label: '⚠️ Важно', value: 'ShieldAlert' },
            { label: '⏰ Время', value: 'Clock' },
            { label: '👤 Человек', value: 'User' },
          ],
        },
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },

    // === 🧱 БЛОКИ КОНТЕНТА ===
    {
      name: 'content_blocks',
      type: 'array',
      label: '📝 Содержание статьи',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', admin: { rows: 6 } },
        {
          name: 'contentType',
          type: 'select',
          options: [
            { label: '— Не добавлять —', value: 'none' },
            { label: '📊 Таблица', value: 'table' },
            { label: '⚠️ Предупреждение', value: 'warning' },
            { label: '✅ Чек-лист', value: 'checklist' },
            { label: '💡 Совет', value: 'tips' },
          ],
          defaultValue: 'none',
        },
        {
          name: 'table',
          type: 'group',
          admin: { condition: (_, sibling) => sibling.contentType === 'table' },
          fields: [
            {
              name: 'headers',
              type: 'group',
              fields: [
                { name: 'header1', type: 'text', required: true },
                { name: 'header2', type: 'text', required: true },
                { name: 'header3', type: 'text', required: true },
              ],
            },
            {
              name: 'rows',
              type: 'array',
              fields: [
                { name: 'cell1', type: 'text', required: true },
                { name: 'cell2', type: 'text', required: true },
                { name: 'cell3', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          name: 'warning',
          type: 'textarea',
          admin: { condition: (_, sibling) => sibling.contentType === 'warning', rows: 4 },
        },
        {
          name: 'checklist',
          type: 'array',
          admin: { condition: (_, sibling) => sibling.contentType === 'checklist' },
          fields: [{ name: 'item', type: 'text', required: true }],
        },
        {
          name: 'tips',
          type: 'textarea',
          admin: { condition: (_, sibling) => sibling.contentType === 'tips', rows: 4 },
        },
      ],
    },

    // === 📚 ПОЛЕЗНЫЕ ССЫЛКИ ===
    {
      name: 'useful_links',
      type: 'array',
      fields: [
        { name: 'href', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },

    // === 🔗 ПОХОЖИЕ СТАТЬИ (в основном контенте, без sidebar) ===

    {
      name: 'related_articles',
      type: 'relationship',
      relationTo: 'Articles',
      label: '🔗 Похожие статьи',
      hasMany: true,
      admin: {
        description: 'Начните вводить заголовок — появится поиск по статьям.',
      },
      filterOptions: ({ id }: any) => ({
        id: { not_equals: id },
      }),
    },

    // === 🔍 SEO ===
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
          required: true,
          admin: { rows: 3 },
        },
        {
          name: 'keywords',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [{ name: 'keyword', type: 'text', required: true }],
        },
        { name: 'noIndex', type: 'checkbox' },
      ],
    },
  ],
}
