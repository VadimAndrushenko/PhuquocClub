import type { CollectionConfig, FieldHookArgs } from 'payload'

/**
 * Хук beforeChange: автоматически заполняет `section` из выбранной подборки.
 */
async function autoFillSection({ data, req }: FieldHookArgs) {
  if (!data?.subsection) {
    data.section = null
    data.category = ''
    return
  }

  try {
    const subsectionId =
      typeof data.subsection === 'object' && data.subsection !== null
        ? (data.subsection as any).id
        : data.subsection

    if (!subsectionId) return

    // Загружаем подборку с depth: 1 чтобы получить section
    const subsection = await req.payload.findByID({
      collection: 'subsections',
      id: subsectionId,
      depth: 1,
    })

    if (!subsection) return

    // 🔥 category = название подборки (title)
    data.category = subsection.title || ''

    // 🔥 section = relationship к родительской секции подборки
    if (subsection.section) {
      data.section =
        typeof subsection.section === 'object' && subsection.section !== null
          ? (subsection.section as any).id
          : subsection.section
    }
  } catch (error) {
    console.error('❌ Ошибка автозаполнения:', error)
  }
}

/**
 * Хук afterRead: преобразует subsection и section в slug'и (строки)
 * вместо огромных вложенных объектов.
 */
function simplifyRelationships({ doc }: { doc: any }) {
  // subsection → slug
  if (doc.subsection && typeof doc.subsection === 'object') {
    doc.subsection = doc.subsection.slug || doc.subsection.id
  }

  // section → slug
  if (doc.section && typeof doc.section === 'object') {
    doc.section = doc.section.slug || doc.section.id
  }

  return doc
}

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subsection', 'section', 'category', 'status'],
    description: 'Статьи для сайта — управляйте контентом здесь',
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
    },
  },
  labels: { singular: 'Статья', plural: 'Статьи' },

  hooks: {
    beforeChange: [autoFillSection],
    beforeValidate: [autoFillSection],
    afterRead: [simplifyRelationships], // 🔥 упрощаем ответ API
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

    // 🔥 ПОДБОРКА (relationship)
    {
      name: 'subsection',
      type: 'relationship',
      relationTo: 'subsections',
      label: '📂 Подборка (подраздел)',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Выберите подборку — category и section заполнятся автоматически.',
      },
    },

    // 🔥 РАЗДЕЛ (relationship к sections — можно выбрать вручную, но автозаполнение приоритетнее)
    {
      name: 'section',
      type: 'relationship',
      relationTo: 'sections',
      label: '📁 Раздел сайта',
      admin: {
        position: 'sidebar',
        description:
          'Автозаполняется из подборки. При необходимости можно переопределить вручную.',
      },
    },

    // 🔥 КАТЕГОРИЯ (авто из подборки, readOnly)
    {
      name: 'category',
      type: 'text',
      label: '🏷️ Категория (авто)',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Берётся автоматически из названия подборки.',
      },
    },

    // === ✍️ ТЕКСТ ===
    {
      name: 'description',
      type: 'textarea',
      label: 'Короткое описание',
      admin: { rows: 3 },
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Вступление',
      admin: { rows: 5 },
    },

    // === 🖼️ МЕДИА ===
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Обложка статьи',
    },

    // === ⏱️ МЕТА ===
    {
      name: 'readTime',
      type: 'text',
      label: 'Время чтения',
    },
    {
      name: 'author',
      type: 'text',
      label: 'Автор',
      defaultValue: 'Phuquoc.Club',
    },

    // === 🎯 БЛОК "КРАТКО" ===
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
            { label: '💰 Деньги / Цена', value: 'DollarSign' },
            { label: '📄 Документы', value: 'FileText' },
            { label: '📍 Местоположение', value: 'MapPin' },
            { label: '⚠️ Важно / Внимание', value: 'ShieldAlert' },
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

    // === 🔗 СВЯЗАННЫЕ СТАТЬИ ===
    {
      name: 'related_articles',
      type: 'array',
      label: '🔗 Похожие статьи',
      fields: [
        { name: 'id', type: 'text' },
        { name: 'category', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', admin: { rows: 3 } },
        { name: 'image', type: 'text' },
        { name: 'href', type: 'text', required: true },
        { name: 'readTime', type: 'text' },
      ],
    },

    // === 📚 ПОЛЕЗНЫЕ ССЫЛКИ ===
    {
      name: 'useful_links',
      type: 'array',
      label: '📚 Полезные ссылки',
      fields: [
        { name: 'href', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },

    // === 🔍 SEO ===
    {
      name: 'seo',
      type: 'group',
      label: '🔍 SEO и мета-теги',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea', admin: { rows: 3 } },
        { name: 'keywords', type: 'array', fields: [{ name: 'keyword', type: 'text' }] },
        { name: 'noIndex', type: 'checkbox' },
      ],
    },
  ],
}