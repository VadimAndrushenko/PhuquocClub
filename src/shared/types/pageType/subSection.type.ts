export interface Articles {
  title: string
  slug: string
  description?: string
  icon?: string
}

export interface SubSection {
  title: string
  slug: string
  description?: string  
  articles: Articles[]
  section: string
  seo: {               
    title: string
    description: string
    keywords: string[]
  }
}

export interface SubSectionPageProps {
  params: Promise<{ section: string; subSection: string }>
}