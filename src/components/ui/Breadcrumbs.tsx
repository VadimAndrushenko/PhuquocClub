import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getSectionTitle, getSubsectionTitle, getArticleTitle } from '@/lib/payload/getBreadcrumbsTitles'

interface BreadcrumbURLProps {
  section?: string
  subsection?: string
  article?: string
}

export default async function Breadcrumbs({ URL }: { URL: BreadcrumbURLProps }) {
  const { section, subsection, article } = URL

  // 🔥 Параллельные запросы к БД (с кешем)
  const [sectionTitle, subsectionTitle, articleTitle] = await Promise.all([
    section ? getSectionTitle(section) : Promise.resolve(''),
    subsection ? getSubsectionTitle(subsection) : Promise.resolve(''),
    article ? getArticleTitle(article) : Promise.resolve(''),
  ])

  console.log(sectionTitle);
  

  const isSectionLast = !subsection && !article
  const isSubsectionLast = subsection && !article

  return (
    <nav aria-label="breadcrumb">
      <ul className="mb-6 flex flex-wrap items-center gap-2 text-sm text-paragraph max-[450px]:gap-0.75 max-[400px]:text-[3.3vw]">
        <li>
          <Link href="/" className="transition-colors hover:text-main">
            Главная
          </Link>
        </li>

        
        <li className="flex items-center">
          <ChevronRight size={16} className="text-[#98A2B3]" />
          {isSectionLast ? (
            <span className="text-main font-medium">{sectionTitle}</span>
          ) : (
            <Link href={`/${section}`} className="transition-colors hover:text-main">
              {sectionTitle}
            </Link>
          )}
        </li>

        {subsection && (
          <li className="flex items-center">
            <ChevronRight size={16} className="text-[#98A2B3]" />
            {isSubsectionLast ? (
              <span className="text-main font-medium">{subsectionTitle}</span>
            ) : (
              <Link
                href={`/${section}/${subsection}`}
                className="transition-colors hover:text-main"
              >
                {subsectionTitle}
              </Link>
            )}
          </li>
        )}

        {article && (
          <li className="flex items-center">
            <ChevronRight size={16} className="text-[#98A2B3]" />
            <span className="text-main font-medium">{articleTitle}</span>
          </li>
        )}
      </ul>
    </nav>
  )
}