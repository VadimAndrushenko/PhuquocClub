"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import getData from "@/lib/api/data_LocalOrServer"
import Link from "next/link"
import clsx from "clsx"

import { 
  LifeBuoy,
  Map,
  DollarSign, 
  Bus,
  FileText,
  Search, 
  UtensilsCrossed, 
  Waves, 
  X 
} from "lucide-react";

import type { Article, SubSection , Section, SearchItem, PagesSearchProps, ServerData } from "@/shared/types/serchInput.type"
import { cn } from "@/lib/utils"


const arrTags = [
  {label: "Где поесть", icon: UtensilsCrossed}, 
  {label: "Что посмотреть", icon: Map},
  {label: "Пляжи", icon: Waves}, 
  {label: "Транспорт", icon: Bus},
  {label: "Цены", icon: DollarSign},
  {label: "Виза", icon: FileText}, 
  {label: "Помощь", icon: LifeBuoy},
]
// обьект для обозночения раздела
const typeLabel = {
  section: "Раздел",
  subSection: "Подраздел",
  article: "Статья",
}

function toArray<T>(data?: T[] | Record<string, T> | null): T[] {
  if (!data) return []
  return Array.isArray(data) ? data : Object.values(data)
}

export default function PagesSearch({ 
    isSmall = false,
    placeholder, 
    classMore = "",
    tags = false,
 }: PagesSearchProps) {

  const [serverData, setServerData] = useState<ServerData | null>(null)
  const [query, setQuery] = useState("") 

  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const searchItems: SearchItem[] = useMemo(() => {
    if (!serverData) return []

    const sections = toArray<Section>(serverData.sections)
    const subSections = toArray<SubSection>(serverData.subSections)
    const articles = toArray<Article>(serverData.articles)
    
    return [
      ...sections.map((section) => ({
        title: section.title,
        description: section.description,
        href: `/${section.slug}`,
        type: "section" as const,
        searchText: `${section.title} ${section.description ?? ""}`.toLowerCase(),
      })),
      ...subSections.map((subSection) => ({
        title: subSection.title,
        description: subSection.description,
        href: `/${subSection.section}/${subSection.slug}`,
        type: "subSection" as const,
        searchText: `${subSection.title} ${subSection.description ?? ""}`.toLowerCase(),
      })),
      ...articles.map((article) => ({
        title: article.title,
        description: article.description,
        href: `/${article.section}/${article.subsection}/${article.slug}`,
        type: "article" as const,
        searchText: `${article.title} ${article.description}`.toLowerCase(),
      })),
    ]
  }, [serverData])
  
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    
    return searchItems.filter(item => item.searchText.includes(q))
  }, [query, searchItems])

  const showDropdown = query.trim().length > 0
  
  const classForSize = clsx(
    isSmall 
    ? "h-8 pl-8 min-w-0 rounded-none border border-input bg-transparent px-2.5 py-1 text-xs transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 md:text-xs dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40" 
    : "w-full h-14 pl-12 pr-4 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
    classMore
  )

  useEffect(() => {
    getData('all')
      .then(data => setServerData(data))
  }, [])

  useEffect(() => {
    
    if (!showDropdown) return

    function handleClickOutside(event: MouseEvent) {
      
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setQuery("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  })

  return (
    <>  
      <div ref={wrapperRef} className="relative flex items-center ">

        {/* Иконка поиска */}
        {isSmall 
          ? <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
          : <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        }
        
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={
            cn(
              "placeholder:text-[#1D293D] text-[#1D293D] bg-white",
              classForSize
            )
          }
        />

      {/* кнопка очистки */}
        {showDropdown && (
          <button 
              onClick={() => setQuery("")}
              className="absolute right-4 text-muted-foreground cursor-pointer"
          >
              <X className={isSmall ? "h-4 w-4" : undefined} />
          </button>
        )}


        <div className={
          cn(
            "absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg transition-all duration-300",
            showDropdown 
              ? "opacity-100 translate-y-0 visible" 
              : "opacity-0 -translate-y-15 invisible",
            "origin-top"
          )}
        >
        
          <div className="max-h-80 overflow-y-auto">
            {results.length > 0 ? (
              results.map((item) => (
                <Link
                  key={`${item.type}-${item.href}`}
                  href={item.href}
                  className="block border-b border-zinc-100 px-4 py-3 last:border-b-0 hover:bg-zinc-50 text-left"
                  onClick={() => setQuery("")}
                >
                    <div className="text-xs text-zinc-500">
                        {typeLabel[item.type]}
                    </div>
                    
                    <div className={`font-medium text-zinc-950 ${isSmall ? "text-sm" : ""}`}>
                        {item.title}
                    </div>
                
                    <p className={` text-zinc-600 ${isSmall ? "text-xs" : "text-sm"}`}>
                        {item.description}
                    </p>
                  
                </Link>
              ))
            ) : showDropdown ? (
              <div className="px-4 py-3 text-sm text-zinc-500">
                Ничего не найдено
              </div>
            ): null}
          </div>
        </div>

    
      </div>
      
      {/* Tags */}
      {tags && (
        <div className="flex flex-wrap justify-start gap-3 mt-4 max-w-[500px] max-sm:gap-1.5">
          {arrTags.map((tag) => (
            <button
              key={tag.label}
              className="px-4 py-2.5 rounded-full bg-white shadow-sm text-sm hover:bg-zinc-100 text-[#314158] max-sm:text-xs max-sm:px-2 max-sm:py-2"
              onClick={() => {setQuery(tag.label)}}
            >
              <tag.icon 
                size={16} 
                className="inline-block mr-1.5" 
                color="var(--color-accent)"
              />
              {tag.label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}