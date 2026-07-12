import type { AppMedia, SearchConfig } from '@/shared/types'

export interface HeroMainProps {
  containerClass?: string
  dataMain: {
    title: string
    description: string
    search: SearchConfig
    image: AppMedia
  }
}
