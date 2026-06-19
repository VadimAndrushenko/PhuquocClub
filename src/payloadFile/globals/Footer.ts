import type { GlobalConfig } from 'payload'

// ============================================
// 🪝 ХУК: извлечь href из ссылок футера
// ============================================
async function enrichFooter({ doc, req }: any): Promise<any> {
  if (!doc) return doc

  // 🔥 Извлекаем секции футера — упрощаем до {label, href}
  const sections = ['sectionPlanning', 'sectionOnIsland', 'sectionPractice', 'sectionRoutes']

  for (const sectionName of sections) {
    const sectionData = doc[sectionName]
    if (!sectionData) continue

    const items: any[] = []

    for (let i = 1; i <= 6; i++) {
      const itemKey = `item${i}` as keyof typeof sectionData
      const item = sectionData[itemKey]
      if (!item || !item.label) continue

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

      items.push({ label: item.label, href })
    }

    // 🔥 ПЕРЕЗАПИСЫВАЕМ секцию с упрощёнными items
    doc[sectionName] = {
      title: sectionData.title || 'Раздел',
      items,
    }
  }

  // 🔥 Извлекаем доп. ссылки — упрощаем до {title, href}
  const additionalLinks = doc.additionalLinks
  if (additionalLinks) {
    const links: any[] = []
    for (let i = 1; i <= 4; i++) {
      const linkKey = `link${i}` as keyof typeof additionalLinks
      const link = additionalLinks[linkKey]
      if (!link || !link.title) continue

      let href = '#'

      // 🔥 ЗАГРУЖАЕМ ТОЛЬКО href ЧЕРЕЗ payload.findByID
      if (link.linkType === 'section' && link.section) {
        const sectionId = typeof link.section === 'object' ? link.section.id : link.section
        const section = await req.payload.findByID({
          collection: 'sections',
          id: sectionId,
          depth: 0,
          select: { href: true },
        })
        href = section?.href || '#'
      } else if (link.linkType === 'subsection' && link.subsection) {
        const subsectionId = typeof link.subsection === 'object' ? link.subsection.id : link.subsection
        const subsection = await req.payload.findByID({
          collection: 'subsections',
          id: subsectionId,
          depth: 0,
          select: { href: true },
        })
        href = subsection?.href || '#'
      } else if (link.linkType === 'article' && link.article) {
        const articleId = typeof link.article === 'object' ? link.article.id : link.article
        const article = await req.payload.findByID({
          collection: 'Articles',
          id: articleId,
          depth: 0,
          select: { href: true },
        })
        href = article?.href || '#'
      } else if (link.linkType === 'external' && link.externalUrl) {
        href = link.externalUrl
      }

      links.push({ title: link.title, href })
    }
    doc.additionalLinks = links
  }

  return doc
}

// ============================================
// 📦 GLOBAL: Footer
// ============================================

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: '🦶 Footer (Подвал)',
  access: {
    read: () => true,
  },
  versions: {
    max: 10,
  },
  hooks: {
    afterRead: [enrichFooter],
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
    // 📝 ОПИСАНИЕ
    // ============================================
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание сайта',
      admin: {
        rows: 4,
        description: 'Текст описания в левом блоке футера',
      },
      defaultValue:
        'Практичный гид по жизни и отдыху на острове Фукуок.\nАктуальная информация, проверенные места и полезные\nсоветы для туристов и экспатов.',
    },

    // ============================================
    // 🌐 СОЦСЕТИ
    // ============================================
    {
      name: 'socialLinks',
      type: 'group',
      label: '🌐 Соцсети',
      fields: [
        {
          name: 'telegram',
          type: 'text',
          label: 'Telegram',
          defaultValue: 'https://t.me/phuquocclub',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram',
          defaultValue: 'https://instagram.com',
        },
        {
          name: 'youtube',
          type: 'text',
          label: 'YouTube',
          defaultValue: 'https://youtube.com/@phuquocclub',
        },
      ],
    },

    // ============================================
    // 📑 СЕКЦИЯ 1: ПЛАНИРОВАНИЕ
    // ============================================
    {
      name: 'sectionPlanning',
      type: 'group',
      label: '📑 Секция: Планирование',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Название секции',
          defaultValue: 'Планирование',
        },
        {
          name: 'item1',
          type: 'group',
          label: 'Ссылка 1',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Когда ехать' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'item2',
          type: 'group',
          label: 'Ссылка 2',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Виза' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'item3',
          type: 'group',
          label: 'Ссылка 3',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Бюджет' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'item4',
          type: 'group',
          label: 'Ссылка 4',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Как добраться' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'item5',
          type: 'group',
          label: 'Ссылка 5',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Страховка' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
      ],
    },

    // ============================================
    // 📑 СЕКЦИЯ 2: НА ОСТРОВЕ
    // ============================================
    {
      name: 'sectionOnIsland',
      type: 'group',
      label: '📑 Секция: На острове',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Название секции',
          defaultValue: 'На острове',
        },
        {
          name: 'item1',
          type: 'group',
          label: 'Ссылка 1',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Жильё' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'item2',
          type: 'group',
          label: 'Ссылка 2',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Еда' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'item3',
          type: 'group',
          label: 'Ссылка 3',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Транспорт' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'item4',
          type: 'group',
          label: 'Ссылка 4',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Подборки' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'item5',
          type: 'group',
          label: 'Ссылка 5',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Пляжи' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'item6',
          type: 'group',
          label: 'Ссылка 6',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Развлечения' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
      ],
    },

    // ============================================
    // 📑 СЕКЦИЯ 3: ПРАКТИКА
    // ============================================
    {
      name: 'sectionPractice',
      type: 'group',
      label: '📑 Секция: Практика',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Название секции',
          defaultValue: 'Практика',
        },
        {
          name: 'item1',
          type: 'group',
          label: 'Ссылка 1',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Деньги' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'item2',
          type: 'group',
          label: 'Ссылка 2',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Связь и интернет' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'item3',
          type: 'group',
          label: 'Ссылка 3',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Аптеки и медицина' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'item4',
          type: 'group',
          label: 'Ссылка 4',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Магазины' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'item5',
          type: 'group',
          label: 'Ссылка 5',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Безопасность' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
      ],
    },

    // ============================================
    // 📑 СЕКЦИЯ 4: МАРШРУТЫ
    // ============================================
    {
      name: 'sectionRoutes',
      type: 'group',
      label: '📑 Секция: Маршруты',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Название секции',
          defaultValue: 'Маршруты',
        },
        {
          name: 'item1',
          type: 'group',
          label: 'Ссылка 1',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Маршруты на 1 день' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'item2',
          type: 'group',
          label: 'Ссылка 2',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Маршруты на 3 дня' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'item3',
          type: 'group',
          label: 'Ссылка 3',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Маршруты на 7 дней' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'item4',
          type: 'group',
          label: 'Ссылка 4',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Север острова' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'item5',
          type: 'group',
          label: 'Ссылка 5',
          fields: [
            { name: 'label', type: 'text', label: 'Название', defaultValue: 'Юг острова' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
      ],
    },

    // ============================================
    // 📄 ДОП. ССЫЛКИ (4 штуки, статично)
    // ============================================
    {
      name: 'additionalLinks',
      type: 'group',
      label: '📄 Дополнительные ссылки',
      fields: [
        {
          name: 'link1',
          type: 'group',
          label: 'Ссылка 1',
          fields: [
            { name: 'title', type: 'text', label: 'Название', defaultValue: 'О проекте' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'link2',
          type: 'group',
          label: 'Ссылка 2',
          fields: [
            { name: 'title', type: 'text', label: 'Название', defaultValue: 'Реклама' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'link3',
          type: 'group',
          label: 'Ссылка 3',
          fields: [
            { name: 'title', type: 'text', label: 'Название', defaultValue: 'Контакты' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
        {
          name: 'link4',
          type: 'group',
          label: 'Ссылка 4',
          fields: [
            { name: 'title', type: 'text', label: 'Название', defaultValue: 'Политика конфиденциальности' },
            {
              name: 'linkType',
              type: 'select',
              label: 'Тип ссылки',
              options: [
                { label: '📁 Раздел', value: 'section' },
                { label: '📂 Подборка', value: 'subsection' },
                { label: '📄 Статья', value: 'article' },
                { label: '🔗 Внешняя', value: 'external' },
              ],
            },
            { name: 'section', type: 'relationship', relationTo: 'sections', label: 'Раздел', admin: { condition: (_, sib) => sib.linkType === 'section' } },
            { name: 'subsection', type: 'relationship', relationTo: 'subsections', label: 'Подборка', admin: { condition: (_, sib) => sib.linkType === 'subsection' } },
            { name: 'article', type: 'relationship', relationTo: 'Articles', label: 'Статья', admin: { condition: (_, sib) => sib.linkType === 'article' } },
            { name: 'externalUrl', type: 'text', label: 'URL', admin: { condition: (_, sib) => sib.linkType === 'external' } },
          ],
        },
      ],
    },
  ],
}
