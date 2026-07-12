export interface SearchItem {
  id: string
  title: string
  description: string | null
  href: string
  type: 'section' | 'subsection' | 'article'
  searchText: string
  searchTagText?: string
  searchIcon?: string
}

export interface SearchResponse {
  items: SearchItem[]
  total: number
  timestamp: number
}
