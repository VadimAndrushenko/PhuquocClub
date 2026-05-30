import type { Metadata } from 'next'
import getData from '@/lib/api/data_LocalOrServer'
import type { SubSection, SubSectionPageProps } from '@/shared/types/subSection.type'
import Link from 'next/link'
import {
  FileText,
  Calendar,
  DollarSign,
  Plane,
  MapPin,
  Package,
  CheckSquare,
  HelpCircle,
  ArrowLeft,
} from 'lucide-react'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

const icons = {
  worth: HelpCircle,
  when: Calendar,
  prices: DollarSign,
  visa: FileText,
  flights: Plane,
  accommodation: MapPin,
  know: CheckSquare,
  packing: Package,
}

async function getSections(): Promise<SubSection[]> {
  const sectionsData = Object.values(await getData('subSections'))
  return sectionsData as SubSection[]
}

// ---------- ГЕНЕРАЦИЯ СТАТИЧЕСКИХ ПАРАМЕТРОВ ----------
// export async function generateStaticParams() {
//   const subSection = await getSections()
//   return subSection.map((subSection) => ({
//     section: subSection.section,
//     subSection: subSection.slug,
//   }))
// }

// // ---------- МЕТАДАННЫЕ ----------
// export async function generateMetadata({ params }: SubSectionPageProps): Promise<Metadata> {
//   const { subSection: sectionParam } = await params

//   const subSections = await getSections()
//   const subSection = subSections.find((s) => s.slug === sectionParam)

//   if (!subSection) {
//     console.error('❌ SubSection not found:', sectionParam)
//     return {
//       title: 'Раздел не найден',
//       description: 'Такой раздел не существует',
//     }
//   }

//   return {
//     title: subSection.seo.title ?? subSection.title,
//     description: subSection.seo.description ?? subSection.description ?? '',
//     keywords: subSection.seo.keywords ?? [],
//   }
// }

export default async function SubSectionPage({ params }: SubSectionPageProps) {
  const { subSection: subSectionParam } = await params
  const subSections = await getSections()

  const subSection = Object.values(subSections).find((s) => s.slug === subSectionParam) as
    | SubSection
    | undefined

  if (!subSection) {
    return <div className="p-10 text-center text-2xl">Под раздел не найден</div>
  }

  return (
    <div className="bg-zinc-50 min-h-[calc(100vh-80px)] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Link
          href={`/${subSection.section}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={18} />
          Назад
        </Link>

        {/* Header */}
        <div className="mb-12">
          {/* хлебные крошки  */}
          <Breadcrumbs
            URL={{
              section: subSection.section,
              subsection: subSection.slug,
            }}
          />

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{subSection.title}</h1>

          {subSection.description && (
            <p className="text-xl text-muted-foreground">{subSection.description}</p>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subSection.articles.map((article) => {
            const Icon = icons[article.slug as keyof typeof icons] || FileText

            return (
              <Link
                key={article.slug}
                href={`/${subSection.section}/${subSection.slug}/${article.slug}`}
                className="
                  group
                  bg-white
                  rounded-2xl
                  p-6
                  shadow-sm
                  hover:shadow-lg
                  transition-all
                  border
                  hover:-translate-y-1
                "
              >
                <div
                  className="
                  w-14 h-14
                  rounded-xl
                  bg-blue-100
                  text-blue-600
                  flex
                  items-center
                  justify-center
                  mb-4
                  group-hover:bg-blue-600
                  group-hover:text-white
                  transition
                "
                >
                  <Icon size={26} />
                </div>

                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>

                {article.description && (
                  <p className="text-muted-foreground text-sm">{article.description}</p>
                )}
              </Link>
            )
          })}
        </div>

        {/* Quick Start */}
        <div
          className="
          mt-14
          bg-gradient-to-br
          from-blue-600
          to-indigo-700
          rounded-2xl
          p-8
          text-white
        "
        >
          <h2 className="text-2xl font-semibold mb-6">С чего начать?</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {subSection.articles.slice(0, 4).map((article, i) => (
              <div key={article.slug} className="flex gap-3">
                <div
                  className="
                  w-8 h-8
                  shrink-0
                  rounded-full
                  bg-white
                  text-blue-600
                  flex
                  items-center
                  justify-center
                  font-bold
                "
                >
                  {i + 1}
                </div>

                <div>
                  <div className="font-medium">{article.title}</div>

                  <div className="text-sm text-blue-100">Подробнее</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
