import type { GlobalConfig } from 'payload'

// ============================================
// 🪝 ХУК: извлечь href из навигации
// ============================================
async function enrichHeader({ doc, req }: any): Promise<any> {
  if (!doc?.navigationItems) return doc

  const enrichedItems: any[] = []

  for (const item of doc.navigationItems) {
    try {
      const enrichedItem: any = {
        id: item.id,
        title: item.title || '',
        icon: item.icon || 'Map',
        linkType: item.linkType || 'external',
      }

      let href = '#'

      // 🔥 ЗАГРУЖАЕМ ТОЛЬКО href ЧЕРЕЗ payload.findByID
      if (item.linkType === 'section' && item.section) {
        const sectionId = typeof item.section === 'object' ? item.section.id : item.section
        const section = await req.payload.findByID({
          collection: 'sections',
          id: sectionId,
          depth: 0,
          select: { href: true },
        })
        href = section?.href || '#'
      } else if (item.linkType === 'subsection' && item.subsection) {
        const subsectionId = typeof item.subsection === 'object' ? item.subsection.id : item.subsection
        const subsection = await req.payload.findByID({
          collection: 'subsections',
          id: subsectionId,
          depth: 0,
          select: { href: true },
        })
        href = subsection?.href || '#'
      } else if (item.linkType === 'article' && item.article) {
        const articleId = typeof item.article === 'object' ? item.article.id : item.article
        const article = await req.payload.findByID({
          collection: 'Articles',
          id: articleId,
          depth: 0,
          select: { href: true },
        })
        href = article?.href || '#'
      } else if (item.linkType === 'external' && item.externalUrl) {
        href = item.externalUrl
      }

      enrichedItem.href = href
      enrichedItems.push(enrichedItem)
    } catch (error) {
      console.error('❌ Ошибка обогащения навигации:', error)
    }
  }

  doc.navigationItems = enrichedItems
  return doc
}

// ============================================
// 📦 GLOBAL: Header Navigation
// ============================================

export const Header: GlobalConfig = {
  slug: 'header',
  label: '📱 Header (Навигация)',
  access: {
    read: () => true,
  },
  versions: {
    max: 10,
  },
  hooks: {
    afterRead: [enrichHeader],
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
      defaultValue: 'published',
      required: true,
      admin: { position: 'sidebar' },
    },

    // ============================================
    // 🧭 НАВИГАЦИЯ (максимум 8 пунктов)
    // ============================================
    {
      name: 'navigationItems',
      type: 'array',
      label: '🧭 Навигация',
      maxRows: 8,
      admin: {
        description: 'Добавьте до 8 пунктов навигации. Ссылка берётся автоматически из выбранного элемента.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Название в меню',
          required: true,
          admin: {
            description: 'Текст который будет отображаться в меню',
          },
        },
        {
          name: 'icon',
          type: 'select',
          label: 'Иконка',
          required: true,
          defaultValue: 'Map',
          options: [
            { label: '🗺️ Карта', value: 'Map' },
            { label: '✈️ Самолёт', value: 'Plane' },
            { label: '🏨 Отель', value: 'Hotel' },
            { label: '🍴 Еда', value: 'UtensilsCrossed' },
            { label: '📍 Местоположение', value: 'MapPin' },
            { label: '🚗 Авто', value: 'Car' },
            { label: '💰 Деньги', value: 'DollarSign' },
            { label: '💡 Советы', value: 'Lightbulb' },
            { label: '🛟 Помощь', value: 'LifeBuoy' },
            { label: '📋 Список', value: 'List' },
            { label: '⭐ Избранное', value: 'Star' },
            { label: '📅 Календарь', value: 'Calendar' },
            { label: '🌊 Море', value: 'Waves' },
            { label: '🌴 Пальма', value: 'Palmtree' },
            { label: '📸 Фото', value: 'Camera' },
            { label: '🎒 Рюкзак', value: 'Backpack' },
          ],
          admin: {
            description: 'Выберите иконку для пункта меню',
          },
        },
        {
          name: 'linkType',
          type: 'select',
          label: 'Тип ссылки',
          required: true,
          options: [
            { label: '📁 Раздел (Section)', value: 'section' },
            { label: '📂 Подборка (Subsection)', value: 'subsection' },
            { label: '📄 Статья (Article)', value: 'article' },
            { label: '🔗 Внешняя ссылка', value: 'external' },
          ],
          admin: {
            description: 'Выберите тип элемента для ссылки',
          },
        },
        {
          name: 'section',
          type: 'relationship',
          relationTo: 'sections',
          label: 'Выберите раздел',
          admin: {
            condition: (_, sibling) => sibling.linkType === 'section',
            description: 'Выберите раздел — ссылка возьмётся автоматически',
          },
        },
        {
          name: 'subsection',
          type: 'relationship',
          relationTo: 'subsections',
          label: 'Выберите подборку',
          admin: {
            condition: (_, sibling) => sibling.linkType === 'subsection',
            description: 'Выберите подборку — ссылка возьмётся автоматически',
          },
        },
        {
          name: 'article',
          type: 'relationship',
          relationTo: 'Articles',
          label: 'Выберите статью',
          admin: {
            condition: (_, sibling) => sibling.linkType === 'article',
            description: 'Выберите статью — ссылка возьмётся автоматически',
          },
        },
        {
          name: 'externalUrl',
          type: 'text',
          label: 'Внешняя ссылка',
          admin: {
            condition: (_, sibling) => sibling.linkType === 'external',
            description: 'Например: https://t.me/phuquocclub',
          },
        },
      ],
    },
  ],
}
