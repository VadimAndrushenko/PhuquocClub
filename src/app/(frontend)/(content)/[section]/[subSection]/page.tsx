import type { Metadata } from 'next'

import ContinuePlanning from '@/components/readyBlock/ContinuePlanning'
import BestSelections from '@/components/readyBlock/BestSelections'
import CollectionsBlock from '@/components/readyBlock/CollectionsBlock'
import { SubSectionPageProps } from '@/shared/types/pageType/subSection.type'
import { getArticleBySlug } from '@/lib/payload'
import Hero from '@/components/readyBlock/Hero'

// ---------- ГЕНЕРАЦИЯ СТАТИЧЕСКИХ ПАРАМЕТРОВ ----------
// export async function generateStaticParams() {
//   const sections = await getSections()
//   return sections.map((section) => ({
//     section: section.slug,
//   }))
// }

// // ---------- МЕТАДАННЫЕ ----------
// export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
//   const { section: sectionParam } = await params
//   const sections = await getSections()
//   const section = sections.find((s) => s.slug === sectionParam)

//   if (!section) {
//     console.error('❌ Section not found:', sectionParam)
//     return {
//       title: 'Раздел не найден',
//       description: 'Такой раздел не существует',
//     }
//   }

//   return {
//     title: section.seo.title ?? section.title,
//     description: section.seo.description ?? section.description ?? '',
//     keywords: section.seo.keywords ?? [],
//   }
// }

const collectionsData = [
  {
    id: 1,
    href: '/food/restaurants',
    category: 'ЕДА',
    image: { 
      url: "http://localhost:3000/api/media/file/collection.png",
      alt: "Collection Image" 
    } ,
    title: 'Топ рестораны',
    description: 'Лучшие места от локальной кухни до изысканных ресторанов.',
    number: 1,
  },
  {
    id: 2,
    href: '/beaches/best',
    category: 'ПЛЯЖИ',
    image: { 
      url: "http://localhost:3000/api/media/file/collection.png",
      alt: "Collection Image" 
    },
    title: 'Лучшие пляжи',
    description: 'Самые красивые и удобные пляжи для отдыха и сноркелинга.',
    number: 2,
  },
  {
    id: 3,
    href: '/routes/1-day',
    category: 'МАРШРУТЫ',
    image: { 
      url: "http://localhost:3000/api/media/file/hero-image-article-1.jpg",
      alt: "Collection Image" 
    },
    title: 'Маршрут на 1 день',
    description: 'Оптимальный план поездки без спешки и переплат.',
    number: 3,
  },
]

const classPY = 'py-10 max-md:py-6'

export default async function SubSectionPage({ params }: SubSectionPageProps) {
  const { section: sectionParam } = await params

const allArticle = await getArticleBySlug('masina')

// Извлекаем URL изображения
const imageUrl =
  typeof allArticle?.image === 'object' && allArticle?.image
    ? allArticle.image.url
    : ""

// Формируем href из section/subsection/slug
const href = allArticle?.section && allArticle?.subsection
  ? `/${allArticle.section}/${allArticle.subsection}/${allArticle.slug}`
  : `/${allArticle?.slug}`

// Собираем итоговый объект
const parsArticle = [{
  id: allArticle?.id,
  href,
  category: allArticle?.category || '',
  image: imageUrl,
  title: allArticle?.title || '',
  description: allArticle?.description || '',
  readTime: allArticle?.readTime || '',
}]

  // Моковые данные для Hero раздела (потом возьмёшь из БД)
  const sectionHeroData = {
    title: 'Транспорт на фукуоке',
    description: 'машины, байки и лодки, которые стоит знать туристу',
    intro:
      'Собрали проверенные места, районы, цены, советы по выбору кухни и подборки для разных сценариев: завтрак, ужин, морепродукты, кофе и локальная еда.',
    category: 'ТРАНСПОРТ',
    section: sectionParam,
    image: {
      url: '/ImageWithFallback.jpg',
      alt: 'Закат на Фукуоке',
    },
    search: {
      placeholder: 'Поиск по сайту: пляжи, отели, еда, транспорт...',
      tags: true,
    },
  }

  return (
    <div className="container">
      <Hero dataHero={sectionHeroData} classes={{ container: `${classPY}` }} />
      <BestSelections className={classPY} data={collectionsData}/>
      <CollectionsBlock
        collections={parsArticle}
        // categories={categories}
        title="Все подборки раздела"
        containerClass={classPY}
        itemsPerPage={4} 
      />

      <ContinuePlanning className={classPY} data={collectionsData}/>
    </div>
  )
}
