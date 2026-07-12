import Link from 'next/link'
import { cn } from '@/lib/utils'
import { LifeBuoy } from 'lucide-react'
import { withLocale } from '@/lib/locale'

interface UrgentHelpSectionProps {
  className?: string
  containerClass?: string
  locale?: string
}

export default function UrgentHelpSection({
  className = '',
  containerClass = '',
  locale = 'ru',
}: UrgentHelpSectionProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden ',
        containerClass,
        className,
      )}
    >
      <div className='p-6 rounded-3xl bg-main'>
        {/* Декоративный элемент - свечение */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-[550px]:text-center">
          {/* Иконка и заголовок */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <LifeBuoy className="text-white/70" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {locale === 'en' ? 'Need help urgently?' : 'Нужно срочно?'}
            </h2>
          </div>

          {/* Описание */}
          <p className="text-white/70 text-sm mb-6 max-w-xl text-left">
            {locale === 'en' ? 'Select a situation — we\'ll show you where to go and what to do first.' : 'Выберите ситуацию — покажем, куда обратиться и что сделать в первую очередь.'}
          </p>

          {/* Кнопка */}
          <Link
            href={withLocale('/help', locale)}
            className="
              inline-block
              px-6 py-3 
              bg-[#D4B46C] 
              hover:bg-[#C4A45C] 
              text-white
              font-medium 
              rounded-full 
              transition-all 
              duration-300 
              hover:-translate-y-0.5
              hover:shadow-lg
            "
          >
            {locale === 'en' ? 'Select situation' : 'Выбрать ситуацию'}
          </Link>

          {/* Disclaimer внизу */}
          <p className="text-white/40 text-xs mt-8 pt-6 border-t border-white/10">
            {locale === 'en' ? 'Does not replace emergency services, but helps you quickly find your way.' : 'Не заменяет экстренные службы, но помогает быстро сориентироваться.'}
          </p>
        </div>
      </div>
    </div>
  )
}
