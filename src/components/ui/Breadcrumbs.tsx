import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbURLProps {
  section?: string;
  subsection?: string;
  article?: string;
}

function formatLabel(value: string) {
  return value.replace(/-/g, " ");
}

export default function Breadcrumbs({ URL }: { URL: BreadcrumbURLProps }) {
  const { section, subsection, article } = URL;

  // Определяем, какой элемент последний
  const isSectionLast = !subsection && !article;
  const isSubsectionLast = subsection && !article;

  return (
    <nav
      
      aria-label="breadcrumb"
    >
      <ul className="mb-6 flex flex-wrap items-center gap-2 text-sm text-paragraph max-[450px]:gap-0.75 max-[400px]:text-[3.3vw]">
        <li>
          <Link
            href="/"
            className="transition-colors hover:text-main"
          >
            Главная
          </Link>
        </li>

        {section && (
          <li className="flex items-center">
            <ChevronRight size={16} className="text-[#98A2B3]" />
            {isSectionLast ? (
              <span className="text-main font-medium">
                {formatLabel(section)}
              </span>
            ) : (
              <Link
                href={`/${section}`}
                className="transition-colors hover:text-main"
              >
                {formatLabel(section)}
              </Link>
            )}
          </li>
        )}

        {subsection && (
          <li className="flex items-center">
            <ChevronRight size={16} className="text-[#98A2B3]" />
            {isSubsectionLast ? (
              <span className="text-main font-medium">
                {formatLabel(subsection)}
              </span>
            ) : (
              <Link
                href={`/${section}/${subsection}`}
                className="transition-colors hover:text-main"
              >
                {formatLabel(subsection)}
              </Link>
            )}
          </li>
        )}

        {article && (
          <li className="flex items-center">
            <ChevronRight size={16} className="text-[#98A2B3]" />
            <span className="text-main font-medium">
              {formatLabel(article)}
            </span>
          </li>
        )}
      </ul>
    </nav>
  );
}