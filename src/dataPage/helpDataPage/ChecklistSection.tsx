import { CircleCheck, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChecklistItemData } from '@/lib/transformData/helpPageTransform'

interface ChecklistSectionProps {
  title: string
  items: ChecklistItemData[]
  badge?: string
  positiveTitle?: string
  warningTitle?: string
  containerClass?: string
  className?: string
}

export default function ChecklistSection({
  title,
  items,
  badge,
  positiveTitle,
  warningTitle,
  containerClass = '',
  className = '',
}: ChecklistSectionProps) {
  if (!items.length) return null

  const positiveItems = items.filter((i) => i.type === 'positive')
  const warningItems = items.filter((i) => i.type === 'warning')

  return (
    <section className={cn('relative', containerClass, className)}>
      <h2 className="title">{title}</h2>

      <div className="bg-block relative overflow-hidden">
        {/* <div className="absolute -top-20 -right-20 w-64 h-64 bg-gray-300/20 rounded-full pointer-events-none z-10" /> */}

        {badge && (
          <span className="inline-block bg-accent/15 text-accent text-xs font-semibold uppercase tracking-wide rounded-full px-4 py-2 mb-6">
            {badge}
          </span>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 relative z-10">
          {positiveItems.length > 0 && (
            <div>
              {positiveTitle && (
                <h3 className="font-bold text-xl md:text-2xl text-main border-b border-gray-100 pb-3 mb-4">
                  {positiveTitle}
                </h3>
              )}
              <ul className="space-y-4">
                {positiveItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CircleCheck size={22} strokeWidth={1.75} className="shrink-0 text-main" />
                    <p className="text-base text-paragraph">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {warningItems.length > 0 && (
            <div>
              {warningTitle && (
                <h3 className="font-bold text-xl md:text-2xl text-main border-b border-gray-100 pb-3 mb-4">
                  {warningTitle}
                </h3>
              )}
              <ul className="space-y-4">
                {warningItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <TriangleAlert size={22} strokeWidth={1.75} className="shrink-0 text-accent" />
                    <p className="text-base text-paragraph">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}