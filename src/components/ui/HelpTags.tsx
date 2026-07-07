import Link from 'next/link'

export interface HelpTag {
  title: string
  href: string
}

interface HelpTagsProps {
  tags: HelpTag[]
  className?: string
}

export default function HelpTags({ tags, className = '' }: HelpTagsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Link
          key={tag.title}
          href={tag.href}
          className="
            px-4 py-2.5 
            bg-[#F5F7FA] 
            hover:bg-[#E8ECF1] 
            text-[var(--color-paragraph)] 
            text-sm 
            font-medium 
            rounded-full 
            transition-all 
            duration-300 
            hover:-translate-y-0.5
            hover:shadow-sm
          "
        >
          {tag.title}
        </Link>
      ))}
    </div>
  )
}
