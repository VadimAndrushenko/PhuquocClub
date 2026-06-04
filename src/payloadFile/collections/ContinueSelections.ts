import type { CollectionConfig } from 'payload'
import { AppMedia, type BestArticleMinimal } from '@/shared/types'

interface ArticleDoc {
  id: string | number
  title: string
  slug: string
  section?: string
  subsection?: string
  category?: string
  description?: string
  intro?: string
  image?: AppMedia | null
  href?: string
  status?: 'draft' | 'published'
  _status?: 'draft' | 'published'
}

interface ContinueSelectionDoc {
  id?: string | number
  title?: string
  slug?: string
  status?: 'draft' | 'published'
  continuePlanning?: BestArticleMinimal[]
}

/**
 * 🔥 Хук afterRead: подтягивает статьи по ID и парсит в continuePlanning
 */
async function parseArticles({
  doc,
  req,
}: {
  doc: ContinueSelectionDoc
  req: any
}): Promise<ContinueSelectionDoc> {
  // 🔥 Не выполняем обогащение в админке при сохранении (избегаем рекурсии)
  const isAdminUI = req.headers?.['referer']?.includes('/admin')
  const isInternal = req.context?.skipEnrich === true

  if (isAdminUI || isInternal) {
    return doc
  }

  // Если нет continuePlanning — пустой результат
  if (
    !doc.continuePlanning ||
    !Array.isArray(doc.continuePlanning) ||
    doc.continuePlanning.length === 0
  ) {
    doc.continuePlanning = []
    return doc
  }

  const minimalArticles: BestArticleMinimal[] = []

  for (const item of doc.continuePlanning) {
    try {
      let article: ArticleDoc | null = null

      // Если это ID (число или строка) — подтягиваем статью
      if (typeof item === 'string' || typeof item === 'number') {
        article = await req.payload.findByID({
          collection: 'Articles',
          id: item,
          depth: 0,
          context: { skipEnrich: true },
        })
      }
      // Если это уже объект с id — подтягиваем полную версию
      else if (typeof item === 'object' && item !== null && 'id' in item) {
        const existingArticle = item as ArticleDoc
        // Если объект уже содержит title — используем его, иначе подтягиваем
        if (existingArticle.title !== undefined && existingArticle.title !== null) {
          article = existingArticle
        } else {
          article = await req.payload.findByID({
            collection: 'Articles',
            id: existingArticle.id,
            depth: 0,
            context: { skipEnrich: true },
          })
        }
      }

      if (!article) continue

      const status = article.status || article._status || 'draft'
      const img = article.image
      const imageUrl = img && typeof img === 'object' && img.url ? img.url : null
      const imageAlt = img && typeof img === 'object' && img.alt ? img.alt : article.title || ''

      // 🔥 Формируем минимальные данные для админки (continuePlanning)
      minimalArticles.push({
        id: article.id,
        title: article.title || null,
        href:
          article.href ||
          `/${article.section || ''}/${article.subsection || ''}/${article.slug || ''}`.replace(
            /\/+/g,
            '/',
          ),
        image: imageUrl ? { url: imageUrl, alt: imageAlt } : null,
        status,
        description: article.description || '',
        category: article.category || undefined,
      })
    } catch (error) {
      console.error('❌ Ошибка обработки статьи:', error)
    }
  }

  doc.continuePlanning = minimalArticles
  return doc
}

export const ContinueSelections: CollectionConfig = {
  slug: 'continueSelections',
  labels: {
    singular: 'Подборка "Продолжить чтение"',
    plural: 'Подборки "Продолжить чтение"',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status'],
  },

  access: {
    read: () => true,
  },

  hooks: {
    afterRead: [parseArticles],
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
      admin: { position: 'sidebar' },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Название подборки',
      required: true,
    },
    {
      name: 'continuePlanning',
      type: 'relationship',
      relationTo: 'Articles',
      label: '🔗 Продолжить чтение',
      hasMany: true,
      required: true,
      admin: {
        description: 'В БД хранятся только ID. Данные формируются автоматически.',
      },
    },
  ],
}
