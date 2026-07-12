'use client'

import Link from 'next/link'
import { Home } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function NotFound() {
  const pathname = usePathname()
  const isEn = pathname.startsWith('/en')

  return (
    <div
      role="alert"
      className="min-h-[calc(100vh-80px)] bg-main flex items-center justify-center px-4"
    >
      <div className="text-center text-white max-w-2xl">
        <h1 className="text-9xl font-bold mb-4">404</h1>
        <h2 className="text-4xl mb-6">{isEn ? 'Page not found' : 'Страница не найдена'}</h2>
        <p className="text-xl mb-8 text-white/70">
          {isEn
            ? 'Sorry, the requested page does not exist. It may have been removed or the address is incorrect.'
            : 'К сожалению, запрашиваемая страница не существует. Возможно, она была удалена или вы ввели неверный адрес.'}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href={isEn ? '/en' : '/'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg"
          >
            <Home size={20} />
            {isEn ? 'Home' : 'На главную'}
          </Link>
        </div>
      </div>
    </div>
  )
}
