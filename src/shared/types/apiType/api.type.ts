// ============================================
// 🔗 API
// ============================================

import { CollectionCardData } from "../componentsType/infoCard.type"


export interface ArticlesApiResponse {
  docs: CollectionCardData[]
  totalDocs: number
  totalPages: number
  page: number
}

export interface ArticlesApiParams {
  page?: number
  limit?: number
  category?: string | null
}