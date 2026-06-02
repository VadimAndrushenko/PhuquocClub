import Collections from '@/dataPage/mainDataPage/SectonCollections'
import Planning from '@/dataPage/mainDataPage/SectonPlanning'
import Popular from '@/dataPage/mainDataPage/SectonPopular'
import Urgent from '@/dataPage/mainDataPage/SectonUrgent'
import HeroMain from '@/dataPage/mainDataPage/HeroMain'

const classContent = 'py-10 max-sm:py-8 container'


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

const heroData = {
  title: 'Гид по Фукуоку',
  description: 'Всё что нужно туристу - быстро и понятно',
  search: {
    placeholder: 'Поиск по сайту: пляжи, отели, еда, транспорт...',
    tags: true,
  },
  image: {
    url: '/hero-image.jpg',
    alt: 'Гид по Фукуоку'
  }
}

export default function Home() {
  return (
    <div>
      <HeroMain containerClass={classContent} dataMain={heroData}/>
      <Popular containerClass={classContent} />
      <Planning containerClass={classContent} />
      <Collections containerClass={classContent} data={collectionsData} />
      <Urgent containerClass={classContent} />
    </div>
  )
}
