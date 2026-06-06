import Link from "next/link";

interface FooterNavSectionProps {
  title: string;
  className?: string;
  items: {
    href: string;
    label: string;
  }[];
}

export default function FooterNavSection({ title, items, className = "" }: FooterNavSectionProps) {
  return (
    <div className={className}>
      <h3 className="font-bold mb-6">{title}</h3>
      <ul className="space-y-4 text-paragraph">
        {items.map((item, index) => (
          <li key={`${item.href}-${index}`}>
            <Link href={item.href} className="hover-underline left transition-colors duration-300 hover:text-black hover:translate-x-1">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}