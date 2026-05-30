import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'section', 'category', 'status'],
    description: 'Статьи для сайта — управляйте контентом здесь',
  },
  versions: { 
    drafts: {
      autosave: { interval: 100 },
    },
  },
  labels: { singular: 'Статья', plural: 'Статьи' },
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
      admin: {
        description: 'Черновик не виден на сайте. Опубликованная статья — видна всем.',
        position: 'sidebar',
      },
    },

    // === 📌 ОСНОВНАЯ ИНФОРМАЦИЯ ===
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок статьи',
      required: true,
      admin: { description: 'Например: "Как арендовать байк на Фукуоке"', position: 'sidebar' },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL-адрес (slug)',
      required: true,
      unique: true,
      admin: { description: 'Адрес статьи: /on-island/transport/[slug]. Только латиница и дефисы.', position: 'sidebar' },
    },
    {
      name: 'section',
      type: 'text',
      label: 'Раздел сайта',
      admin: { description: 'Например: on-island, before-trip', position: 'sidebar' },
    },
    {
      name: 'subsection',
      type: 'text',
      label: 'Подраздел',
      admin: { description: 'Например: transport, accommodation', position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'text',
      label: 'Категория (для бейджа)',
      admin: { description: 'Например: ТРАНСПОРТ, ЕДА, БЕЗОПАСНОСТЬ' },
    },

    // === ✍️ ТЕКСТ ===
    {
      name: 'description',
      type: 'textarea',
      label: 'Короткое описание',
      admin: { description: 'Показывается под заголовком. 1-2 предложения.', rows: 3 },
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Вступление',
      admin: { description: 'Первый абзац статьи.', rows: 5 },
    },

    // === 🖼️ МЕДИА ===
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Обложка статьи',
      admin: { description: 'Главное изображение. Рекомендуемый размер: 1200×800 px.' },
    },

    // === ⏱️ МЕТА ===
    {
      name: 'readTime',
      type: 'text',
      label: 'Время чтения',
      admin: { description: 'Например: "6 мин"' },
    },
    {
      name: 'author',
      type: 'text',
      label: 'Автор',
      defaultValue: 'Phuquoc.Club',
      admin: { description: 'Кто написал статью' },
    },

    // === 🎯 БЛОК "КРАТКО" ===
    {
      name: 'kratko_items',
      type: 'array',
      label: '📋 Блок "Кратко"',
      admin: {
        description: 'Карточки с важной информацией. Можно добавить 0–10 элементов.',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: '🎨 Иконка',
          required: true,
          options: [
            { label: '💰 Деньги / Цена', value: 'DollarSign' },
            { label: '📄 Документы', value: 'FileText' },
            { label: '📍 Местоположение', value: 'MapPin' },
            { label: '⚠️ Важно / Внимание', value: 'ShieldAlert' },
            { label: '⏰ Время', value: 'Clock' },
            { label: '👤 Человек', value: 'User' },
          ],
          admin: { description: 'Какая иконка будет слева' },
        },
        {
          name: 'label',
          type: 'text',
          label: '🏷️ Подпись',
          required: true,
          admin: { description: 'Например: "Цена", "Документы"' },
        },
        {
          name: 'value',
          type: 'text',
          label: '💬 Значение',
          required: true,
          admin: { description: 'Например: "от 150 000 VND"' },
        },
      ],
    },

// === 🧱 БЛОКИ КОНТЕНТА  ===
{
  name: 'content_blocks',
  type: 'array',  
  label: '📝 Содержание статьи',
  admin: {
    description: 'Нажмите "Добавить" — секция добавится сразу',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: '🔹 Заголовок секции',
      required: true,
      admin: { description: 'Например: "Где арендовать байк"' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: '🔹 Основной текст',
      admin: { description: 'Содержание секции', rows: 6 },
    },
    {
      name: 'contentType',
      type: 'select',
      label: '🔹 Дополнительный элемент',
      options: [
        { label: '— Не добавлять —', value: 'none' },
        { label: '📊 Таблица', value: 'table' },
        { label: '⚠️ Предупреждение', value: 'warning' },
        { label: '✅ Чек-лист', value: 'checklist' },
        { label: '💡 Совет', value: 'tips' },
      ],
      defaultValue: 'none',
      admin: { description: 'Что показать после текста (необязательно)' },
    },
    // 📊 ТАБЛИЦА
    {
      name: 'table',
      type: 'group',
      label: '📊 Настройки таблицы',
      admin: { condition: (_, sibling) => sibling.contentType === 'table' },
      fields: [
        {
          name: 'headers',
          type: 'group',
          label: 'Заголовки столбцов',
          fields: [
            { name: 'header1', type: 'text', label: 'Название 1', required: true },
            { name: 'header2', type: 'text', label: 'Название 2', required: true },
            { name: 'header3', type: 'text', label: 'Название 3', required: true }
          ],
        },
        {
          name: 'rows',
          type: 'array',
          label: 'Строки',
          fields: [
            { name: 'cell1', type: 'text', label: 'Ячейка 1', required: true },
            { name: 'cell2', type: 'text', label: 'Ячейка 2', required: true },
            { name: 'cell3', type: 'text', label: 'Ячейка 3', required: true },
          ],
        },
      ],
    },
    // ⚠️ ПРЕДУПРЕЖДЕНИЕ
    {
      name: 'warning',
      type: 'textarea',
      label: '⚠️ Текст предупреждения',
      admin: { condition: (_, sibling) => sibling.contentType === 'warning', rows: 4 },
    },
    // ✅ ЧЕК-ЛИСТ
    {
      name: 'checklist',
      type: 'array',
      label: '✅ Пункты чек-листа',
      admin: { condition: (_, sibling) => sibling.contentType === 'checklist' },
      fields: [{ name: 'item', type: 'text', label: 'Пункт', required: true }],
    },
    // 💡 СОВЕТ
    {
      name: 'tips',
      type: 'textarea',
      label: '💡 Текст совета',
      admin: { condition: (_, sibling) => sibling.contentType === 'tips', rows: 4 },
    },
  ],
},

    // === 🔗 СВЯЗАННЫЕ СТАТЬИ ===
    {
      name: 'related_articles',
      type: 'array',
      label: '🔗 Похожие статьи',
      admin: {
        description: 'Рекомендации в конце статьи.',
      },
      fields: [
        { name: 'id', type: 'text', label: 'ID', admin: { description: 'Уникальный идентификатор' } },
        { name: 'category', type: 'text', label: 'Категория' },
        { name: 'title', type: 'text', label: 'Заголовок', required: true },
        { name: 'description', type: 'textarea', label: 'Описание', admin: { rows: 3 } },
        { name: 'image', type: 'text', label: 'Путь к изображению' },
        { name: 'href', type: 'text', label: 'Ссылка', required: true },
        { name: 'readTime', type: 'text', label: 'Время чтения' },
      ],
    },

    // === 📚 ПОЛЕЗНЫЕ ССЫЛКИ ===
    {
      name: 'useful_links',
      type: 'array',
      label: '📚 Полезные ссылки',
      admin: { description: 'Ссылки на другие разделы.' },
      fields: [
        { name: 'href', type: 'text', label: '🔗 URL', required: true },
        { name: 'label', type: 'text', label: '🏷️ Текст', required: true },
      ],
    },

    // === 🔍 SEO ===
    {
      name: 'seo',
      type: 'group',
      label: '🔍 SEO и мета-теги',
      admin: { description: 'Настройки для поисковиков' },
      fields: [
        { name: 'title', type: 'text', label: '📄 SEO-заголовок', admin: { description: 'До 60 символов' } },
        { name: 'description', type: 'textarea', label: '📝 SEO-описание', admin: { description: 'До 160 символов', rows: 3 } },
        {
          name: 'keywords',
          type: 'array',
          label: '🏷️ Ключевые слова',
          fields: [{ name: 'keyword', type: 'text', label: 'Слово' }],
        },
        { name: 'noIndex', type: 'checkbox', label: '🚫 Не индексировать', admin: { description: 'Для черновиков' } },
      ],
    },
  ],
}