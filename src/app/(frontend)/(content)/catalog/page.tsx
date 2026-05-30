import getData from '@/lib/api/data_LocalOrServer'
import type { Section } from '@/shared/types/section.type'
import Link from 'next/link'
import {
  FileText,
  Calendar,
  DollarSign,
  Plane,
  MapPin,
  Package,
  CheckSquare,
  HelpCircle
} from "lucide-react"

const icons = {
  worth: HelpCircle,
  when: Calendar,
  prices: DollarSign,
  visa: FileText,
  flights: Plane,
  accommodation: MapPin,
  know: CheckSquare,
  packing: Package
}

async function getSections(): Promise<Section[]> {
  const sectionsData = Object.values(await getData('sections'))
  return sectionsData as Section[]
}

export default async function SectionPage() {
  const sections = await getSections()   

  if (!sections) {
    return (
      <div className="p-10 text-center text-2xl">
        Раздел не найден
      </div>
    )
  }

  return (
    <div className="bg-zinc-50 min-h-[calc(100vh-80px)] py-12">

      <div className="container">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Каталог: разделов
          </h1>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {sections.map((section) => {
            const Icon =
              icons[section.slug as keyof typeof icons] || FileText

            return (
              <Link
                key={section.slug}
                href={`/${section.slug}`}
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
                <div className="
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
                ">
                  <Icon size={26} />
                </div>

                <h2 className="text-xl font-semibold mb-2">
                  {section.title}
                </h2>

                {section.description && (
                  <p className="text-muted-foreground text-sm">
                    {section.description}
                  </p>
                )}
              </Link>
            )
          })}

        </div>

      </div>
    </div>
  )
}
