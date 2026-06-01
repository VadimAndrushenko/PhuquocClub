import Hero from '@/components/readyBlock/Hero';
import { HeroMainProps } from '@/shared/types/main.type';

export default function HeroMain({
  dataMain,
  containerClass = '',
}: HeroMainProps) {

    return (
      <Hero
        dataHero={dataMain}
        classes={{
          container:
            `${containerClass} md:min-h-[calc(100vh-80px)]`,
          content: '',
          title: 'font-medium text-[76px] leading-[80px] max-sm:text-nowrap max-sm:text-[12vw]',
          description: 'font-normal text-2xl leading-snug max-sm:text-xl',
          image: 'w-[620px] h-auth ',
        }}
      />
    )
}