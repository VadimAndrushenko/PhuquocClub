interface BreadcrumbItem {
  position: number
  name: string
  item: string
}

interface BuildBreadcrumbsProps {
  section?: string
  sectionTitle?: string
  subsection?: string
  subsectionTitle?: string
  article?: string
  articleTitle?: string
  baseUrl: string
}

/**
 * 🍞 Построить массив для BreadcrumbList Schema.org
 */
export function buildBreadcrumbItems({
  section,
  sectionTitle,
  subsection,
  subsectionTitle,
  article,
  articleTitle,
  baseUrl,
}: BuildBreadcrumbsProps): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    {
      position: 1,
      name: 'Главная',
      item: baseUrl,
    },
  ]

  if (section && sectionTitle) {
    items.push({
      position: items.length + 1,
      name: sectionTitle,
      item: `${baseUrl}/${section}`,
    })
  }

  if (subsection && subsectionTitle) {
    items.push({
      position: items.length + 1,
      name: subsectionTitle,
      item: `${baseUrl}/${section}/${subsection}`,
    })
  }

  if (article && articleTitle) {
    items.push({
      position: items.length + 1,
      name: articleTitle,
      item: `${baseUrl}/${section}/${subsection}/${article}`,
    })
  }

  return items
}
