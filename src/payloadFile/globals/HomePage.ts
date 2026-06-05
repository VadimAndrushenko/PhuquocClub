import type { GlobalConfig } from 'payload'
import { AppMedia, type BestArticleMinimal } from '@/shared/types'

// ============================================
// 🔧 ТИПЫ
// ============================================

interface ArticleDoc {
  id: string | number
  title: string
  slug: string
  section?: string
  subsection?: string
  category?: string
  description?: string
  image?: AppMedia | null
  href?: string
  status?: 'draft' | 'published'
  _status?: 'draft' | 'published'
  readTime?: string
}

interface SubsectionDoc {
  id: string | number
  title: string
  slug: string
  section?: string | { slug?: string }
  category?: string
  description?: string
  image?: AppMedia | null
  href?: string
  status?: 'draft' | 'published'
}

interface HomePageDoc {
  id?: string | number
  status?: 'draft' | 'published'
  heroTitle?: string
  heroDescription?: string
  heroImage?: AppMedia | null
  searchPlaceholder?: string
  searchTags?: Array<{
    title: string
    icon: 'utensilsCrossed' | 'map' | 'waves' | 'bus' | 'dollarSign' | 'fileText' | 'lifeBuoy'
  }>
  popularArticles?: (string | number)[]
  planningArticles?: (string | number)[]
  collections?: (string | number)[]
  urgentArticles?: (string | number)[]
  seo?: {
    title: string
    description: string
    keywords?: Array<{ keyword: string }>
  }
}

interface MinimalCollectionData {
  id: number | string
  href: string
  category: string
  image: { url: string; alt: string } | null
  title: string
  description: string
  number: number
}

// ============================================
// 🔧 ХУКИ: Извлечение данных из статей
// ============================================

async function parsePopularArticles({
  doc,
  req,
}: {
  doc: HomePageDoc
  req: any
}): Promise<HomePageDoc> {
  const isAdminUI = req.headers?.['referer']?.includes('/admin')
  const isInternal = req.context?.skipEnrich === true

  if (isAdminUI || isInternal || !doc.popularArticles || doc.popularArticles.length === 0) {
    return doc
  }

  // Сохраняем в doc для использования в компоненте
  ;(doc as any)._popularArticlesData = await extractArticlesData(
    doc.popularArticles,
    req,
    'popular',
  )
  return doc
}

async function parsePlanningArticles({
  doc,
  req,
}: {
  doc: HomePageDoc
  req: any
}): Promise<HomePageDoc> {
  const isAdminUI = req.headers?.['referer']?.includes('/admin')
  const isInternal = req.context?.skipEnrich === true

  if (isAdminUI || isInternal || !doc.planningArticles || doc.planningArticles.length === 0) {
    return doc
  }

  ;(doc as any)._planningArticlesData = await extractArticlesData(
    doc.planningArticles,
    req,
    'planning',
  )
  return doc
}

async function parseCollections({
  doc,
  req,
}: {
  doc: HomePageDoc
  req: any
}): Promise<HomePageDoc> {
  const isAdminUI = req.headers?.['referer']?.includes('/admin')
  const isInternal = req.context?.skipEnrich === true

  if (isAdminUI || isInternal || !doc.collections || doc.collections.length === 0) {
    return doc
  }

  ;(doc as any)._collectionsData = await extractSubsectionsData(doc.collections, req)
  return doc
}

async function parseUrgentArticles({
  doc,
  req,
}: {
  doc: HomePageDoc
  req: any
}): Promise<HomePageDoc> {
  const isAdminUI = req.headers?.['referer']?.includes('/admin')
  const isInternal = req.context?.skipEnrich === true

  if (isAdminUI || isInternal || !doc.urgentArticles || doc.urgentArticles.length === 0) {
    return doc
  }

  ;(doc as any)._urgentArticlesData = await extractArticlesData(doc.urgentArticles, req, 'urgent')
  return doc
}

// ============================================
// 🔧 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

async function extractArticlesData(
  ids: (string | number)[],
  req: any,
  context: string,
): Promise<BestArticleMinimal[]> {
  const articles: BestArticleMinimal[] = []

  for (const id of ids) {
    try {
      const article = await req.payload.findByID({
        collection: 'Articles',
        id,
        depth: 0,
        context: { skipEnrich: true },
      })

      if (!article) continue

      const status = article.status || article._status || 'draft'
      const img = article.image as AppMedia | null
      const imageUrl = img?.url || null
      const imageAlt = img?.alt || article.title || ''

      articles.push({
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
        readTime: article.readTime || undefined,
      })
    } catch (error) {
      console.error(`❌ Ошибка обработки статьи для ${context}:`, error)
    }
  }

  return articles
}

async function extractSubsectionsData(
  ids: (string | number)[],
  req: any,
): Promise<MinimalCollectionData[]> {
  const collections: MinimalCollectionData[] = []

  for (let index = 0; index < ids.length; index++) {
    const id = ids[index]
    try {
      const subsection = await req.payload.findByID({
        collection: 'subsections',
        id,
        depth: 0,
        context: { skipEnrich: true },
      })

      if (!subsection) continue

      const img = subsection.image as AppMedia | null
      const imageUrl = img?.url || null
      const imageAlt = img?.alt || subsection.title || ''

      const sectionSlug =
        typeof subsection.section === 'object' && subsection.section !== null
          ? (subsection.section as any).slug || ''
          : String(subsection.section || '')

      collections.push({
        id: subsection.id,
        href: subsection.href || `/${sectionSlug}/${subsection.slug || ''}`,
        category: subsection.category || '',
        image: imageUrl ? { url: imageUrl, alt: imageAlt } : null,
        title: subsection.title || '',
        description: subsection.description || '',
        number: index + 1,
      })
    } catch (error) {
      console.error('❌ Ошибка обработки подборки для collections:', error)
    }
  }

  return collections
}

// ============================================
// 📦 GLOBAL: Главная страница
// ============================================

export const HomePage: GlobalConfig = {
  slug: 'homePage',
  label: '🏠 Главная страница',
  access: {
    read: () => true,
  },
  versions: {
    drafts: {
      autosave: {
        interval: 2000,
      },
    },
    max: 50,
  },
  hooks: {
    // afterRead: [parsePopularArticles, parsePlanningArticles, parseCollections, parseUrgentArticles],
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

    // ============================================
    // 🎯 HERO БЛОК
    // ============================================
    {
      name: 'heroSection',
      type: 'group',
      label: '🎯 Hero блок',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок',
          required: true,
          defaultValue: 'Гид по Фукуоку',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Описание',
          required: true,
          admin: { rows: 3 },
          defaultValue: 'Всё что нужно туристу - быстро и понятно',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Обложка Hero',
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
              defaultValue: 'Поиск по сайту: пляжи, отели, еда, транспорт...',
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
      ],
    },

    // ============================================
    // 🔥 ПОПУЛЯРНЫЕ СТАТЬИ
    // ============================================
    {
      name: 'popularArticles',
      type: 'relationship',
      relationTo: 'Articles',
      label: '🔥 Популярные статьи',
      hasMany: true,
      admin: {
        description:
          'Выберите 3 статьи для блока "Популярные". Извлекутся: title, description, image, category, readTime.',
      },
    },

    // ============================================
    // 📋 ПЛАНИРОВАНИЕ
    // ============================================
    {
      name: 'planningBlock',
      type: 'group',
      label: '📋 Планирование',
      fields: [
        {
          name: 'articles',
          type: 'relationship',
          relationTo: 'Articles',
          label: 'Статьи',
          hasMany: true,
          admin: {
            description: 'Выберите 4 статьи для блока "Планирование".',
          },
        },
        {
          name: 'icons',
          type: 'array',
          label: 'Иконки для статей',
          admin: {
            description: 'Добавьте иконки для каждой статьи (в том же порядке).',
          },
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Иконка',
              required: true,
              options: [
                { label: '☀️ Солнце', value: 'Sun' },
                { label: '📖 Книга', value: 'BookType' },
                { label: '💰 Кошелёк', value: 'Wallet' },
                { label: '🏠 Дом', value: 'House' },
                { label: '✈️ Самолёт', value: 'Plane' },
                { label: '🗺️ Карта', value: 'Map' },
                { label: '🌊 Волны', value: 'Waves' },
                { label: '🍴 Еда', value: 'Utensils' },
              ],
            },
          ],
        },
      ],
    },

    // ============================================
    // 📚 ПОДБОРКИ (Collections)
    // ============================================
    {
      name: 'collections',
      type: 'relationship',
      relationTo: 'subsections',
      label: '📚 Подборки (Collections)',
      hasMany: true,
      admin: {
        description:
          'Выберите подборки для блока "Подборки". Извлекутся: title, description, image, category.',
      },
    },

    // ============================================
    // ⚡ СРОЧНОЕ
    // ============================================
    {
      name: 'urgentBlock',
      type: 'group',
      label: '⚡ Срочное (Urgent)',
      fields: [
        {
          name: 'articles',
          type: 'relationship',
          relationTo: 'Articles',
          label: 'Статьи',
          hasMany: true,
          admin: {
            description: 'Выберите 4 статьи для блока "Срочное".',
          },
        },
        {
          name: 'icons',
          type: 'array',
          label: 'Иконки для статей',
          admin: {
            description: 'Добавьте иконки для каждой статьи (в том же порядке).',
          },
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Иконка',
              required: true,
              options: [
                { label: '☀️ Солнце', value: 'Sun' },
                { label: '📖 Книга', value: 'BookType' },
                { label: '💰 Кошелёк', value: 'Wallet' },
                { label: '🏠 Дом', value: 'House' },
                { label: '✈️ Самолёт', value: 'Plane' },
                { label: '🗺️ Карта', value: 'Map' },
                { label: '🌊 Волны', value: 'Waves' },
                { label: '🍴 Еда', value: 'Utensils' },
              ],
            },
          ],
        },
      ],
    },

    // ============================================
    // 🔍 SEO
    // ============================================
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
