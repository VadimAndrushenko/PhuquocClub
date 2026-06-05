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

    const subsection = await req.payload.findByID({
      collection: 'subsections',
      id: subsectionId,
      depth: 1,
    })

    if (!subsection) return

    data.category = (subsection as { category?: string }).category || ''

    const sectionField = (subsection as { section?: unknown }).section
    if (sectionField) {
      if (typeof sectionField === 'string') {
        data.section = sectionField
      } else if (
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
  // 🔥 ВРЕМЕННО ОТКЛЮЧЕНО — нет таблицы в БД
  /*
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
  */

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
        description: 'Выберите подборку. Раздел и категория подтянутся автоматически.',
      },
    },
    {
      name: 'section',
      type: 'text',
      label: '📁 Раздел сайта (авто)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Заполняется автоматически из выбранной подборки.',
      },
    },
    {
      name: 'category',
      type: 'text',
      label: '🏷️ Категория (авто)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Берётся из поля category в subsections.',
      },
    },
    {
      name: 'href',
      type: 'text',
      label: '🔗 Ссылка на статью (авто)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Генерируется автоматически из section, subsection и slug.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Короткое описание',
      required: true,
      admin: {
        rows: 3,
        description: 'Краткий анонс статьи для карточек и превью.',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Вступление',
      required: true,
      admin: {
        rows: 5,
        description: 'Первый текстовый блок статьи, который задаёт контекст.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Обложка статьи',
      required: true,
      admin: {
        description: 'Главное изображение статьи для карточек, превью и SEO.',
      },
    },
    {
      name: 'readTime',
      type: 'text',
      label: 'Время чтения',
      required: true,
      admin: {
        description: 'Например: 5 мин, 8 мин, 12 мин.',
      },
    },
    {
      name: 'author',
      type: 'text',
      label: 'Автор',
      required: true,
      defaultValue: 'Phuquoc.Club',
      admin: {
        description: 'Имя автора статьи.',
      },
    },
    {
      name: 'kratko_items',
      type: 'array',
      label: '📋 Блок "Кратко"',
      admin: {
        description: 'Короткие факты и ключевые данные по статье.',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          admin: {
            description: 'Выберите подходящую иконку для пункта.',
          },
          options: [
            { label: '💰 Деньги', value: 'DollarSign' },
            { label: '📄 Документы', value: 'FileText' },
            { label: '📍 Местоположение', value: 'MapPin' },
            { label: '⚠️ Важно', value: 'ShieldAlert' },
            { label: '⏰ Время', value: 'Clock' },
            { label: '👤 Человек', value: 'User' },
          ],
        },
        { name: 'label', type: 'text', required: true, admin: { description: 'Название пункта.' } },
        { name: 'value', type: 'text', required: true, admin: { description: 'Значение пункта.' } },
      ],
    },
    {
      name: 'content_blocks',
      type: 'array',
      label: '📝 Содержание статьи',
      admin: {
        description: 'Основные смысловые блоки статьи.',
      },
      fields: [
        { name: 'title', type: 'text', required: true, admin: { description: 'Заголовок блока.' } },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            rows: 6,
            description: 'Основной текст блока.',
          },
        },
        {
          name: 'contentType',
          type: 'select',
          defaultValue: 'none',
          admin: {
            description: 'Тип дополнительного контента внутри блока.',
          },
          options: [
            { label: '— Не добавлять —', value: 'none' },
            { label: '📊 Таблица', value: 'table' },
            { label: '⚠️ Предупреждение', value: 'warning' },
            { label: '✅ Чек-лист', value: 'checklist' },
            { label: '💡 Совет', value: 'tips' },
          ],
        },
        // 🔥 ТАБЛИЦА (показывается только когда contentType === 'table')
        {
          name: 'table',
          type: 'group',
          admin: {
            condition: (_, sibling) => sibling.contentType === 'table',
            description: 'Настройте заголовки и строки таблицы.',
          },
          fields: [
            {
              name: 'headers',
              type: 'group',
              fields: [
                { name: 'header1', type: 'text', required: true, label: 'Заголовок 1' },
                { name: 'header2', type: 'text', required: true, label: 'Заголовок 2' },
                { name: 'header3', type: 'text', required: true, label: 'Заголовок 3' },
              ],
            },
            {
              name: 'rows',
              type: 'array',
              label: 'Строки таблицы',
              fields: [
                { name: 'cell1', type: 'text', required: true, label: 'Ячейка 1' },
                { name: 'cell2', type: 'text', required: true, label: 'Ячейка 2' },
                { name: 'cell3', type: 'text', required: true, label: 'Ячейка 3' },
              ],
            },
          ],
        },
        // 🔥 ПРЕДУПРЕЖДЕНИЕ (когда contentType === 'warning')
        {
          name: 'warning',
          type: 'textarea',
          admin: {
            condition: (_, sibling) => sibling.contentType === 'warning',
            rows: 4,
            description: 'Текст важного предупреждения.',
          },
        },
        // 🔥 ЧЕК-ЛИСТ (когда contentType === 'checklist')
        {
          name: 'checklist',
          type: 'array',
          label: 'Пункты чек-листа',
          admin: {
            condition: (_, sibling) => sibling.contentType === 'checklist',
            description: 'Добавьте пункты чек-листа.',
          },
          fields: [{ name: 'item', type: 'text', required: true, label: 'Текст пункта' }],
        },
        // 🔥 СОВЕТ (когда contentType === 'tips')
        {
          name: 'tips',
          type: 'textarea',
          admin: {
            condition: (_, sibling) => sibling.contentType === 'tips',
            rows: 4,
            description: 'Текст полезного совета.',
          },
        },
      ],
    },
    {
      name: 'useful_links',
      type: 'array',
      admin: {
        description: 'Ссылки на полезные внешние материалы.',
      },
      fields: [
        { name: 'href', type: 'text', required: true, admin: { description: 'Ссылка.' } },
        { name: 'label', type: 'text', required: true, admin: { description: 'Название ссылки.' } },
      ],
    },
    {
      name: 'related_articles',
      type: 'relationship',
      relationTo: 'Articles',
      label: '🔗 Похожие статьи',
      hasMany: true,
      admin: {
        description: 'Выберите статьи, которые нужно показать в блоке похожих.',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: '🔍 SEO и мета-теги',
      admin: {
        description: 'Параметры для поиска и отображения в выдаче.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'SEO-заголовок',
          required: true,
          admin: { description: 'Заголовок для поисковиков и соцсетей.' },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'SEO-описание',
          required: true,
          admin: {
            rows: 3,
            description: 'Краткое описание страницы для поиска.',
          },
        },
        {
          name: 'keywords',
          type: 'array',
          required: true,
          minRows: 1,
          admin: {
            description: 'Ключевые слова через отдельные элементы списка.',
          },
          fields: [{ name: 'keyword', type: 'text', required: true }],
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          admin: {
            description: 'Включи, если страницу не нужно индексировать.',
          },
        },
      ],
    },
  ],
}
