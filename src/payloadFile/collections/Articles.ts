import type { CollectionConfig, CollectionBeforeChangeHook, CollectionBeforeValidateHook } from 'payload'
import { generateHrefBeforeSave, simplifyRelationships } from '../utils/hooks'

/**
 * ============================================
 * 📦 COLLECTION: Articles
 * ============================================
 * Optimized version with:
 * - Removed heavy afterRead hooks
 * - href generated in beforeChange (more efficient)
 * - Simplified relationships
 * - Better type safety
 */

/**
 * Auto-fill section and category from subsection
 */
type AutoFillHook = CollectionBeforeChangeHook & CollectionBeforeValidateHook

const autoFillFromSubsection: AutoFillHook = async ({ data, req }) => {
  if (!data) return data

  if (!data.subsection) {
    data.section = ''
    data.category = ''
    return data
  }

  try {
    const subsectionId =
      typeof data.subsection === 'object' && 'id' in data.subsection
        ? data.subsection.id
        : data.subsection

    if (!subsectionId) return data

    const subsection = await req.payload.findByID({
      collection: 'subsections',
      id: subsectionId,
      depth: 0,
      locale: req.locale as 'ru' | 'en' | undefined,
    })

    if (!subsection) return data

    // Set category
    data.category = subsection.category || ''

    // Set section slug
    if (subsection.section) {
      if (typeof subsection.section === 'string') {
        data.section = subsection.section
      } else if (typeof subsection.section === 'object' && 'slug' in subsection.section) {
        data.section = subsection.section.slug || ''
      }
    }
  } catch (error) {
    console.error('❌ Error in autoFillFromSubsection:', error)
  }

  return data
}

export const Articles: CollectionConfig = {
  slug: 'Articles',
  
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subsection', 'category', 'status'],
    description: 'Статьи сайта — основной контент. Каждая статья привязана к подразделу и содержит текст, таблицы, полезные ссылки и SEO-данные.',
  },

  versions: {
    maxPerDoc: 50,
  },

  labels: {
    singular: 'Статья',
    plural: 'Статьи',
  },

  hooks: {
    beforeChange: [autoFillFromSubsection, generateHrefBeforeSave],
    beforeValidate: [autoFillFromSubsection],
    afterRead: [simplifyRelationships],
  },

  fields: [
    // === STATUS ===
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
        position: 'sidebar',
        description: 'Черновик — статья не видна на сайте. Опубликовано — статья доступна посетителям.',
      },
      index: true,
    },

    // === BASIC INFO ===
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок статьи',
      required: true,
      minLength: 3,
      maxLength: 200,
      localized: true,
      admin: {
        position: 'sidebar',
        description: 'Главный заголовок статьи. Отображается в карточках, хлебных крошках и SEO.',
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
        description: 'Уникальная часть URL статьи. Только латиница, дефисы и цифры. Пример: "kak-dobratsya-do-fukuoka"',
      },
      index: true,
    },

    // === RELATIONSHIPS ===
    {
      name: 'subsection',
      type: 'relationship',
      relationTo: 'subsections',
      label: '📂 Подраздел',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Выберите подраздел, к которому относится статья. Раздел и категория заполнятся автоматически.',
      },
      index: true,
    },
    {
      name: 'section',
      type: 'text',
      label: '📁 Раздел (авто)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Заполняется автоматически из выбранного подраздела. Изменение вручную невозможно.',
      },
      index: true,
    },
    {
      name: 'category',
      type: 'text',
      label: '🏷️ Категория (авто)',
      localized: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Заполняется автоматически из категории подраздела. Изменение вручную невозможно.',
      },
      index: true,
    },
    {
      name: 'href',
      type: 'text',
      label: '🔗 Полный URL (авто)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Генерируется автоматически на основе раздела, подраздела и slug. Изменение вручную невозможно.',
      },
    },

    // === CONTENT ===
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
        description: 'Краткое описание для карточек, превью и SEO. Отображается под заголовком в списках статей.',
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
        description: 'Первый абзац статьи, который задаёт контекст. Отображается сразу под заголовком на странице статьи.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Обложка',
      required: true,
      admin: {
        description: 'Главное изображение статьи. Используется в карточках, превью и SEO-разметке. Рекомендуемый размер: 1200×630px.',
      },
    },
    {
      name: 'readTime',
      type: 'text',
      label: 'Время чтения',
      required: true,
      admin: {
        description: 'Время чтения в минутах. Только цифра. Пример: 5, 8, 12',
      },
    },
    {
      name: 'author',
      type: 'text',
      label: 'Автор',
      required: true,
      defaultValue: 'Phuquoc.Club',
      maxLength: 100,
      localized: true,
      admin: {
        description: 'Имя автора статьи. Отображается в шапке статьи.',
      },
    },

    // === KRATKO SECTION ===
    {
      name: 'kratko_items',
      type: 'array',
      label: '📋 Быстрые факты',
      labels: {
        singular: 'Факт',
        plural: 'Быстрые факты',
      },
      localized: true,
      admin: {
        description: 'Ключевые факты и данные, которые отображаются в блоке "Коротко" в верхней части статьи. Например: валюта, документы, время полёта.',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Иконка',
          required: true,
          options: [
            { label: '💰 Деньги', value: 'DollarSign' },
            { label: '📄 Документы', value: 'FileText' },
            { label: '📍 Местоположение', value: 'MapPin' },
            { label: '⚠️ Важно', value: 'ShieldAlert' },
            { label: '⏰ Время', value: 'Clock' },
            { label: '👤 Человек', value: 'User' },
          ],
          admin: {
            description: 'Иконка, которая отображается рядом с фактом.',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Название',
          required: true,
          maxLength: 100,
          localized: true,
          admin: {
            description: 'Короткая подпись. Например: "Валюта", "Документы", "Время полёта"',
          },
        },
        {
          name: 'value',
          type: 'text',
          label: 'Значение',
          required: true,
          maxLength: 200,
          localized: true,
          admin: {
            description: 'Значение факта. Например: "Вьетнамский донг (VND)", "Загранпаспорт", "3.5 часа"',
          },
        },
      ],
    },

    // === CONTENT BLOCKS ===
    {
      name: 'content_blocks',
      type: 'array',
      label: '📝 Блоки контента',
      labels: {
        singular: 'Блок контента',
        plural: 'Блоки контента',
      },
      localized: true,
      admin: {
        description: 'Основное содержание статьи. Каждый блок — это заголовок + текст + опциональный дополнительный элемент (таблица, предупреждение, чеклист или совет).',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок блока',
          required: true,
          maxLength: 200,
          localized: true,
          admin: {
            description: 'Заголовок смыслового блока. Отображается как подзаголовок в статье и в навигации по статье.',
          },
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Основной текст',
          required: true,
          localized: true,
          admin: {
            description: 'Основное содержание блока. Поддерживает форматирование: жирный, курсив, списки, ссылки.',
          },
        },
        {
          name: 'contentType',
          type: 'select',
          label: 'Дополнительный элемент',
          defaultValue: 'none',
          options: [
            { label: '— Без элемента —', value: 'none' },
            { label: '📊 Таблица', value: 'table' },
            { label: '⚠️ Предупреждение', value: 'warning' },
            { label: '✅ Чеклист', value: 'checklist' },
            { label: '💡 Совет', value: 'tips' },
          ],
          admin: {
            description: 'Дополнительный элемент после текста: таблица с данными, предупреждение, список для проверки или полезный совет.',
          },
        },
        // TABLE
        {
          name: 'table',
          type: 'group',
          label: '📊 Таблица',
          admin: {
            condition: (_, sibling) => sibling.contentType === 'table',
            description: 'Таблица с тремя колонками. Заголовки и строки локализуются отдельно для каждого языка.',
          },
          fields: [
            {
              name: 'headers',
              type: 'group',
              label: 'Заголовки колонок',
              admin: {
                description: 'Названия трёх колонок таблицы.',
              },
              fields: [
                { name: 'header1', type: 'text', label: 'Колонка 1', required: true, localized: true },
                { name: 'header2', type: 'text', label: 'Колонка 2', required: true, localized: true },
                { name: 'header3', type: 'text', label: 'Колонка 3', required: true, localized: true },
              ],
            },
            {
              name: 'rows',
              type: 'array',
              label: 'Строки таблицы',
              localized: true,
              admin: {
                description: 'Данные таблицы. Каждая строка — три ячейки, соответствующие колонкам.',
              },
              fields: [
                { name: 'cell1', type: 'text', label: 'Ячейка 1', required: true, localized: true },
                { name: 'cell2', type: 'text', label: 'Ячейка 2', required: true, localized: true },
                { name: 'cell3', type: 'text', label: 'Ячейка 3', required: true, localized: true },
              ],
            },
          ],
        },
        // WARNING
        {
          name: 'warning',
          type: 'textarea',
          label: '⚠️ Текст предупреждения',
          localized: true,
          admin: {
            condition: (_, sibling) => sibling.contentType === 'warning',
            rows: 4,
            description: 'Важное предупреждение или примечание. Отображается в выделенном блоке.',
          },
        },
        // CHECKLIST
        {
          name: 'checklist',
          type: 'array',
          label: '✅ Чеклист',
          localized: true,
          admin: {
            condition: (_, sibling) => sibling.contentType === 'checklist',
            description: 'Список пунктов для проверки. Каждый пункт — отдельный элемент списка.',
          },
          fields: [
            {
              name: 'item',
              type: 'text',
              label: 'Пункт',
              required: true,
              localized: true,
              admin: {
                description: 'Один пункт чеклиста. Например: "Взять загранпаспорт"',
              },
            },
          ],
        },
        // TIPS
        {
          name: 'tips',
          type: 'textarea',
          label: '💡 Полезный совет',
          localized: true,
          admin: {
            condition: (_, sibling) => sibling.contentType === 'tips',
            rows: 4,
            description: 'Полезный совет или лайфхак. Отображается в выделенном блоке с иконкой.',
          },
        },
        // CONTINUATION TEXT
        {
          name: 'descriptionAfter',
          type: 'richText',
          label: 'Текст после элемента',
          localized: true,
          admin: {
            condition: (_, sibling) => sibling.contentType !== 'none',
            description: 'Дополнительный текст, который отображается после таблицы/предупреждения/чеклиста/совета.',
          },
        },
      ],
    },

    // === USEFUL LINKS ===
    {
      name: 'useful_links',
      type: 'array',
      label: '🔗 Полезные ссылки',
      labels: {
        singular: 'Полезная ссылка',
        plural: 'Полезные ссылки',
      },
      admin: {
        description: 'Ссылки на связанные статьи, разделы или внешние ресурсы. Отображаются в блоке "Полезно" внизу статьи.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Текст ссылки',
          required: true,
          maxLength: 200,
          localized: true,
          admin: {
            description: 'Текст, который увидит пользователь. Например: "Как добраться до Фукуока"',
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
            description: 'Выберите тип ссылки: раздел сайта, подраздел, статья или внешний URL',
          },
        },
        {
          name: 'section',
          type: 'relationship',
          relationTo: 'sections',
          label: 'Раздел',
          admin: {
            condition: (_, sibling) => sibling?.linkType === 'section',
            description: 'Выберите раздел сайта (например: "Когда ехать", "На острове")',
          },
        },
        {
          name: 'subsection',
          type: 'relationship',
          relationTo: 'subsections',
          label: 'Подраздел',
          admin: {
            condition: (_, sibling) => sibling?.linkType === 'subsection',
            description: 'Выберите подраздел внутри раздела (например: "Сезоны", "Погода")',
          },
        },
        {
          name: 'article',
          type: 'relationship',
          relationTo: 'Articles',
          label: 'Статья',
          admin: {
            condition: (_, sibling) => sibling?.linkType === 'article',
            description: 'Выберите конкретную статью сайта',
          },
        },
        {
          name: 'externalUrl',
          type: 'text',
          label: 'Внешний URL',
          admin: {
            condition: (_, sibling) => sibling?.linkType === 'external',
            description: 'Полный URL внешнего ресурса. Например: https://example.com/page',
          },
        },
      ],
    },

    // === RELATED ARTICLES ===
    {
      name: 'related_articles',
      type: 'relationship',
      relationTo: 'Articles',
      label: '🔗 Похожие статьи',
      hasMany: true,
      maxRows: 6,
      admin: {
        description: 'Выберите статьи, которые будут отображаться в блоке "Похожие статьи" внизу страницы. Максимум 6 статей.',
      },
    },

    // === SEO ===
    {
      name: 'seo',
      type: 'group',
      label: '🔍 SEO и метаданные',
      admin: {
        description: 'Настройки для поисковых систем: заголовок, описание, ключевые слова. Заполняются отдельно для каждого языка.',
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
            description: 'Заголовок для поисковой выдачи (title). До 70 символов. Должен быть уникальным и содержать ключевые слова.',
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
            description: 'Описание для поисковой выдачи (meta description). До 160 символов. Кратко и по делу.',
          },
        },
        {
          name: 'keywords',
          type: 'array',
          label: 'Ключевые слова',
          required: true,
          minRows: 1,
          maxRows: 10,
          localized: true,
          admin: {
            description: 'Ключевые слова для SEO. От 1 до 10 слов. Например: "Фукуок, отдых, пляжи, отели"',
          },
          fields: [
            {
              name: 'keyword',
              type: 'text',
              label: 'Ключевое слово',
              required: true,
              maxLength: 50,
              localized: true,
              admin: {
                description: 'Одно ключевое слово или фраза.',
              },
            },
          ],
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          label: 'Запретить индексацию',
          admin: {
            description: 'Отметьте, чтобы запретить поисковым системам индексировать эту страницу (noindex).',
          },
        },
      ],
    },
  ],
}