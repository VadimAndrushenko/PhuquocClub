export interface Subsection {
  title: string
  slug: string
  description?: string
  icon?: string
}

export interface Section {
  title: string
  slug: string
  description?: string  
  subsections: Subsection[]
  seo: {               
    title: string
    description: string
    keywords: string[]
  }
}

export interface SectionPageProps {
  params: Promise<{ section: string }>
}