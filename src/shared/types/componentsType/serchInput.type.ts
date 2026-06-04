import { SearchConfig, SearchIconType } from '..'

export interface SectionData {
  id: number
  title: string
  slug: string
  description?: string | null
}

export interface SubSectionData {
  id: number
  title: string
  slug: string
  href: string
  description?: string | null
}

export interface ArticleData {
  id: number
  title: string
  slug: string
  href: string
  description?: string | null
}

export interface SearchItem {
  title: string
  description?: string | null
  href: string
  type: 'section' | 'subSection' | 'article'
  searchText: string
  searchTagText?: string
  searchIcon?: SearchIconType
}

export interface SearchData {
  sections: SectionData[]
  subSections: SubSectionData[]
  articles: ArticleData[]
}

export interface SearchInputProps {
  search?: SearchConfig
  onClose?: () => void
}
