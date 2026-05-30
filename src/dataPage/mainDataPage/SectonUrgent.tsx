
import { Sun, BookType, Wallet, House } from "lucide-react";

import { cn } from '@/lib/utils';
import { InfoCard } from "@/components/ui/InfoCard";

const infoCards = [
  {
    icon: Sun,
    title: "Когда ехать",
    description: "Погода по месяцам, сезон дождей и лучшее время для отдыха.",
    href: "/when-to-go",
    titleLink: "Подробнее",
  },
  {
    icon: BookType,
    title: "Виза",
    description: "Нужна ли виза, на какой срок можно находиться и как продлить.",
    href: "/visa",
    titleLink: "Подробнее",
  },
  {
    icon: Wallet,
    title: "Бюджет",
    description: "Сколько стоит отдых на Пхукете: перелёт, жильё, еда, транспорт и экскурсии.",
    href: "/budget",
    titleLink: "Подробнее",
  },
  {
    icon: House,
    title: "Где жить",
    description: "Районы острова, типы жилья и советы по выбору лучшего варианта.",
    href: "/where-to-live",
    titleLink: "Подробнее",
  },
];

export default function Urgent({
    className = "" 
}: {
    className?: string 
} ) {
    
  return (
    <section className="bg-urgent bg-cover bg-centerpy-20">
      <div className={cn("py-20 max-sm:py-10",className)}>
        
        <div className="flex items-center gap-2 mb-4">
          <h2 className="title text-white">Срочно нужно</h2>
        </div>

        <InfoCard
          arr={infoCards}
        />

      </div>
    </section>
  );
}