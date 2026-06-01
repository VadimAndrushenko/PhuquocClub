import Collections from '@/dataPage/mainDataPage/SectonCollections'
import Planning from '@/dataPage/mainDataPage/SectonPlanning'
import Popular from '@/dataPage/mainDataPage/SectonPopular'
import Urgent from '@/dataPage/mainDataPage/SectonUrgent'
import HeroMain from '@/dataPage/mainDataPage/HeroMain'

const classContent = 'py-10 max-sm:py-8 container'

const heroData = {
  title: 'Гид по Фукуоку',
  description: 'Всё что нужно туристу - быстро и понятно',
  search: {
    placeholder: 'Поиск по сайту: пляжи, отели, еда, транспорт...',
    tags: true,
  },
  image: '/hero-image.jpg',
}

export default function Home() {
  return (
    <div>
      <HeroMain containerClass={classContent} dataMain={heroData}/>
      <Popular containerClass={classContent} />
      <Planning containerClass={classContent} />
      <Collections containerClass={classContent} />
      <Urgent containerClass={classContent} />
    </div>
  )
}
