import Image from 'next/image';
import SearchInput from '@/components/ui/SearchInput';
import { cn } from '@/lib/utils';

export default function Hero({
    className = "" 
}: {
    className?: string 
} ) {

    return (
        <section className={cn(
            "relative flex max-xl:flex-col pt-16 pb-24 items-center justify-between gap-12 overflow-hidden min-h-[calc(100vh-80px)] max-xl:justify-center max-sm:pt-10 max-sm:pb-20",
            className
        )}>
            <div>
                <h1 className="font-medium text-[76px] tracking-tight text-nowrap max-xl:text-white max-sm:text-[44px]">
                    Гид по Фукуоку
                </h1>

                <p className=" mt-4 font-normal text-2xl leading-snug text-[#45556C] max-xl:text-white/80 max-sm:text-xl">
                    Всё что нужно туристу - быстро и понятно
                </p>

                {/* Search */}
                <div className="mt-8">
                    <SearchInput 
                        placeholder="Поиск по сайту: пляжи, отели, еда, транспорт..."
                        tags={true}
                    />
                </div>   
            </div>

            <div className="xl:relative max-xl:absolute max-xl:inset-0 -z-10 xl:w-[620px] xl:h-[520px]">
                <Image
                    src="/hero-image.jpg"
                    alt="Hero"
                    fill
                    className="
                    xl:rounded-4xl
                    object-cover
                    "
                />
            </div>
        </section>
    )
}