import { CollectionsCard } from '@/components/ui/InfoCard';
import { cn } from '@/lib/utils';

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

export default function BestSelections({
  data,
  className = "", 
}: {
  data?: any
  className?: string 
} ) {

  return (
    <section className={cn("rounded-3xl", className)}>
      <div className="">
        <div className="flex items-center gap-2">
          <h2 className="title">Лучшие подборки</h2>
        </div>
        <CollectionsCard 
            heightInPx={280}
            data={data}
        />
      </div>
    </section>
  );
}