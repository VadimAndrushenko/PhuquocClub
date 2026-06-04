import type { AppMedia, SearchConfig } from '@/shared/types'

// ============================================
// 🖼️ ТИПЫ ДАННЫХ
// ============================================

/** Основные данные для Hero компонента */
export interface HeroData {
  /** Главный заголовок */
  title: string
  /** Подзаголовок (fallback для description) */
  subtitle?: string
  /** Описание */
  description?: string
  /** Вступительный текст */
  intro?: string
  /** Категория (бейдж) */
  category?: string
  /** Изображение */
  image: AppMedia
  /** Раздел (для хлебных крошек) */
  section?: string
  /** Подраздел (для хлебных крошек) */
  subsection?: string
  /** Slug статьи (для хлебных крошек) */
  slug?: string
  /** Время чтения */
  readTime?: string
  /** Автор */
  author?: string
  /** Дата обновления (ISO строка) */
  updatedAt?: string
  /** Дата создания (ISO строка) */
  createdAt?: string
  /** Настройки поиска */
  search?: SearchConfig
}

// ============================================
// 🎨 ТИПЫ КЛАССОВ
// ============================================

/** Кастомные классы для элементов Hero */
interface HeroClasses {
  /** Внешний контейнер (header/section) */
  container?: string
  /** Блок с текстовым контентом */
  content?: string
  /** Бейдж категории */
  category?: string
  /** Заголовок H1 */
  title?: string
  /** Описание */
  description?: string
  /** Обёртка поиска */
  search?: string
  /** Блок метаданных */
  meta?: string
  /** Элемент метаданных (время, дата, автор) */
  metaItem?: string
  /** Вступительный текст */
  intro?: string
  /** Обёртка изображения */
  imageWrapper?: string
  /** Само изображение */
  image?: string
}

// ============================================
// ⚙️ ТИПЫ ПРОПСОВ
// ============================================

/** Пропсы компонента Hero */
export interface HeroProps {
  /** Данные для отображения */
  dataHero: HeroData
  /** Использовать <header> вместо <section> */
  thisHeader?: boolean
  /** Кастомные классы для элементов */
  classes?: HeroClasses
  /** Дополнительный класс для контейнера */
  className?: string
}
