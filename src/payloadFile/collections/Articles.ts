import type { CollectionConfig, FieldHookArgs, Where } from 'payload'

// ============================================
// 🔧 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

/** Генерирует href из section/subsection/slug */
function generateHref(doc: any): string {
  if (!doc) return '/'
  
  const sectionSlug = typeof doc.section === 'object' && doc.section 
    ? doc.section.slug 
    : doc.section || ''
    
  const subsectionSlug = typeof doc.subsection === 'object' && doc.subsection 
    ? doc.subsection.slug 
    : doc.subsection || ''
    
  const articleSlug = doc.slug || ''
  
  if (sectionSlug && subsectionSlug && articleSlug) {
    return `/${sectionSlug}/${subsectionSlug}/${articleSlug}`
  }
  return `/${articleSlug}`
}

// ============================================
// 🪝 ХУКИ
// ============================================

async function autoFillFromSubsection({ data, req }: FieldHookArgs<Record<string, unknown>>): Promise<void> {
  if (!data?.subsection) {
    data.section = ''
    data.category = ''
    return
  }

  try {
    const subsectionId = typeof data.subsection === 'object' && data.subsection !== null && 'id' in data.subsection
      ? (data.subsection as { id: string }).id
      : data.subsection as string

    if (!subsectionId) return

    const subsection = await req.payload.findByID({
      collection: 'subsections',
      id: subsectionId,
      depth: 1,
    })

    if (!subsection) return

    data.category = (subsection as { title?: string }).title || ''

    const sectionField = (subsection as { section?: unknown }).section
    if (sectionField) {
      const sectionSlug = typeof sectionField === 'object' && sectionField !== null && 'slug' in sectionField
        ? (sectionField as { slug?: string }).slug
        : null
      data.section = sectionSlug || ''
    }
  } catch (error) {
    console.error('❌ Ошибка автозаполнения:', error)
  }
}

/**
 * 🔥 ГЛАВНЫЙ ХУК: генерирует href для статьи и всех связанных статей
 * + упрощает subsection в slug
 */
function enrichWithHref({ doc }: { doc: any }): any {
  if (!doc) return doc

  // 1. Генерируем href для текущей статьи
  doc.href = generateHref(doc)

  // 2. Упрощаем subsection в slug (строку)
  if (doc.subsection && typeof doc.subsection === 'object' && doc.subsection !== null && 'slug' in doc.subsection) {
    doc.subsection = doc.subsection.slug
  }

  // 3. 🔥 Генерируем href для каждой связанной статьи
  if (Array.isArray(doc.related_articles)) {
    doc.related_articles = doc.related_articles.map((article: any) => {
      if (article && typeof article === 'object' && 'slug' in article) {
        return {
          ...article,
          href: generateHref(article), // ← автоматический href!
        }
      }
      return article
    })
  }

  return doc
}

// ============================================
// 📦 КОЛЛЕКЦИЯ
// ============================================

export const Articles: CollectionConfig = {
  slug: 'Articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subsection', 'section', 'category', 'status'],
    description: 'Статьи для сайта — управляйте контентом здесь',
  },
  versions: { drafts: { autosave: { interval: 100 } } },
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

    // === 🔗 ПОХОЖИЕ СТАТЬИ (в основном контенте, без sidebar) ===

    // === 🔥 ВИРТУАЛЬНОЕ ПОЛЕ href (только для чтения, заполняется хуком) ===
    {
      name: 'href',
      type: 'text',
      label: '🔗 Ссылка на статью (авто)',
      admin: {
        readOnly: true,
        description: 'Генерируется автоматически из раздела, подборки и slug.',
      },
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
          name: 'icon', type: 'select', required: true,
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
          name: 'contentType', type: 'select',
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
          name: 'table', type: 'group',
          admin: { condition: (_, sibling) => sibling.contentType === 'table' },
          fields: [
            {
              name: 'headers', type: 'group',
              fields: [
                { name: 'header1', type: 'text', required: true },
                { name: 'header2', type: 'text', required: true },
                { name: 'header3', type: 'text', required: true },
              ],
            },
            {
              name: 'rows', type: 'array',
              fields: [
                { name: 'cell1', type: 'text', required: true },
                { name: 'cell2', type: 'text', required: true },
                { name: 'cell3', type: 'text', required: true },
              ],
            },
          ],
        },
        { name: 'warning', type: 'textarea', admin: { condition: (_, sibling) => sibling.contentType === 'warning', rows: 4 } },
        { name: 'checklist', type: 'array', admin: { condition: (_, sibling) => sibling.contentType === 'checklist' }, fields: [{ name: 'item', type: 'text', required: true }] },
        { name: 'tips', type: 'textarea', admin: { condition: (_, sibling) => sibling.contentType === 'tips', rows: 4 } },
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
    {
      name: 'related_articles',
      type: 'relationship',
      relationTo: 'Articles',
      label: '🔗 Похожие статьи',
      hasMany: true,
      maxDepth: 1, // 🔥 Payload подгружает полные объекты статей
      admin: {
        description: 'Начните вводить заголовок — появится поиск по статьям.',
      },
      filterOptions: ({ id }): Where => {
        if (!id || typeof id !== 'string') {
          return { status: { equals: 'published' } }
        }
        return {
          and: [
            { id: { not_equals: id } },
            { status: { equals: 'published' } },
          ],
        }
      },
    },

    // === 🔍 SEO ===
    {
      name: 'seo',
      type: 'group',
      label: '🔍 SEO и мета-теги',
      fields: [
        { name: 'title', type: 'text', label: 'SEO-заголовок', required: true },
        { name: 'description', type: 'textarea', label: 'SEO-описание', required: true, admin: { rows: 3 } },
        { name: 'keywords', type: 'array', required: true, minRows: 1, fields: [{ name: 'keyword', type: 'text', required: true }] },
        { name: 'noIndex', type: 'checkbox' },
      ],
    },
  ],
}