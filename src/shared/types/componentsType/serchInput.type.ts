import type { LucideIcon } from 'lucide-react';

export interface SearchItem {
  title: string
  description?: string
  href: string
  type: "article" | "section" | "subSection"
  searchText: string
}

export interface Section {
  title: string
  description?: string
  slug: string
}

export interface SubSection {
  title: string
  description?: string
  slug: string
  section: string
}

export interface Article {
  title: string
  description: string
  slug: string
  section: string
  subsection: string
}



export interface PagesSearchProps {
  isSmall?: boolean;
  placeholder: string;
  classMore?: string;
  tags?: boolean
  // arrTags?: { 
  //   label: string;
  //   icon: LucideIcon 
  // }[];
};

export interface ServerData {
  articles: Article[]
  sections: Section[]
  subSections: SubSection[]
} 