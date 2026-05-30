import { cn } from '@/lib/utils'
import type { SectionBlock } from '@/shared/types/article.type'
import { CircleAlert, CircleCheck, Lightbulb } from 'lucide-react'

export const ContentComponents = {
  table: ({ item }: { item: SectionBlock }) => {
    if (!item.table) return null

    return (
      <div className="w-full mt-12">
        <div className="w-full overflow-x-auto rounded-[20px] border-2 border-gray-100 bg-white shadow-sm">
          <table className="w-full border-collapse min-w-[700px]">
            <thead className="bg-[#f9fafb]">
              <tr>
                {item.table.headers.map((header, headerIndex) => (
                  <th
                    key={headerIndex}
                    className="px-6 py-5 text-left font-semibold text-gray-700 border-b border-gray-200 whitespace-nowrap max-sm:px-2"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {item.table.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="transition-colors">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={cn(
                        'px-6 py-5 align-top text-left leading-[1.6] text-[#364153] whitespace-nowrap max-sm:px-2',
                        cellIndex === 0 && 'font-medium text-gray-800'
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },

  warning: ({ item }: { item: SectionBlock }) => {
    if (!item.warning) return null

    return (
      <div className="mt-12 border border-[#d0fae5] rounded-[20px] p-6 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)] bg-[#ecfdf5]/50 font-normal text-[17px] leading-relaxed text-[#006045]/90">
        <span className="flex gap-3 font-bold text-lg leading-normal mb-2">
          <CircleAlert size={24} />
          Важно знать
        </span>
        <span className="opacity-80 flex">
          <span className="h-full w-9 shrink-0 max-sm:hidden"></span>
          {item.warning}
        </span>
      </div>
    )
  },

  tips: ({ item }: { item: SectionBlock }) => {
    if (!item.tips) return null

    return (
      <div className="mt-12 border border-[rgba(201,167,93,0.3)] rounded-[20px] p-6 shadow bg-[#fdf9f0] font-normal text-[17px] leading-relaxed text-[#9A7D3E]">
        <span className="flex gap-3 font-bold text-lg leading-normal mb-2">
          <Lightbulb size={24} />
          Полезный совет
        </span>
        <span className="opacity-80 flex">
          <span className="h-full w-9 shrink-0 max-sm:hidden"></span>
          {item.tips}
        </span>
      </div>
    )
  },

  checklist: ({ item }: { item: SectionBlock }) => {
    if (!item.checklist) return null

    return (
      <div className="mt-12 bg-block">
        <ul className="grid grid-cols-1 gap-y-4 min-[510px]:grid-cols-2 gap-x-10">
          {item.checklist.map((text, i) => (
            <li
              key={i}
              className="flex items-start gap-3 font-normal text-[17px] leading-[1.6] text-[#1e2939]"
            >
              <CircleCheck className="text-accent w-5" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  },
} as const