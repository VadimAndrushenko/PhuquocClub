import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getSectionTitle, getSubsectionTitle, getArticleTitle } from '@/lib/payload/getBreadcrumbsTitles'
import { withLocale } from '@/lib/locale'

interface BreadcrumbURLProps {
  section?: string
  subsection?: string
  article?: string
}

export default async function Breadcrumbs({ URL, locale = 'ru' }: { URL: BreadcrumbURLProps; locale?: string }) {
  const { section, subsection, article } = URL

  // 🔥 Параллельные запросы к БД (с кешем)
  const [sectionTitle, subsectionTitle, articleTitle] = await Promise.all([
    section ? getSectionTitle(section, locale) : Promise.resolve(''),
    subsection ? getSubsectionTitle(subsection, locale) : Promise.resolve(''),
    article ? getArticleTitle(article, locale) : Promise.resolve(''),
  ])
  

  const isSectionLast = !subsection && !article
  const isSubsectionLast = subsection && !article

  return (
    <nav aria-label="breadcrumb">
      <ul className="mb-6 flex flex-wrap items-center gap-1 text-sm text-paragraph max-[450px]:gap-0.75 max-[400px]:text-[3.3vw]">
        <li>
          <Link href={withLocale('/', locale)} className="transition-colors hover:text-main">
            {locale === 'en' ? 'Home' : 'Главная'}
          </Link>
        </li>
        
        <li className="flex items-center">
          <ChevronRight size={16} className="text-[#98A2B3] mr-1" />
          {isSectionLast ? (
            <span className="text-main font-medium">{sectionTitle}</span>
          ) : (
            <Link href={withLocale(`/${section}`, locale)} className="transition-colors hover:text-main">
              {sectionTitle}
            </Link>
          )}
        </li>

        {subsection && (
          <li className="flex items-center">
            <ChevronRight size={16} className="text-[#98A2B3] mr-1" />
            {isSubsectionLast ? (
              <span className="text-main font-medium">{subsectionTitle}</span>
            ) : (
              <Link
                href={withLocale(`/${section}/${subsection}`, locale)}
                className="transition-colors hover:text-main"
              >
                {subsectionTitle}
              </Link>
            )}
          </li>
        )}

        {article && (
          <li className="flex items-center">
            <ChevronRight size={16} className="text-[#98A2B3] mr-1" />
            <span className="text-main font-medium">{articleTitle}</span>
          </li>
        )}
      </ul>
    </nav>
  )
}