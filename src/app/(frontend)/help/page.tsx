import Hero from '@/components/readyBlock/Hero'
import UrgentHelpBlock from '@/components/readyBlock/UrgentHelpBlock'
import type { Metadata } from 'next'

// Статичные данные для страницы помощи
const HELP_DATA = {
  category: 'Помощь туристу',
  title: 'Помощь на Фукуоке',
  description: 'Быстрые ответы и полезные сервисы, когда нужно сориентироваться на острове',
  intro:
    'Такси, аптеки, интернет, магазины, медицина, документы, безопасность и частые вопросы туристов — собрали всё, что может понадобиться во время поездки.',
  noImage: true,
  search: {
    placeholder: 'Что найти: такси, аптека, SIM-карта, врач, магазин...',
    tags: [
      { title: 'Такси', href: '/help/taxi' },
      { title: 'Аптека', href: '/help/pharmacy' },
      { title: 'Интернет', href: '/help/internet' },
      { title: 'Магазины', href: '/help/shops' },
      { title: 'Медицина', href: '/help/medicine' },
      { title: 'Документы', href: '/help/documents' },
      { title: 'Безопасность', href: '/help/safety' },
      { title: 'Связаться', href: '/help/contacts' },
    ],
  },
}

// ============================================
// 🔥 ISR - РЕВАЛИДАЦИЯ КАЖДЫЕ 30 СЕКУНД
// ============================================
export const revalidate = 30
export const dynamic = 'force-static'

// ============================================
// 📄 МЕТАДАННЫЕ (СТАТИЧНЫЕ)
// ============================================
export const metadata: Metadata = {
  title: 'Помощь на Фукуоке',
  description: 'Быстрые ответы и полезные сервисы, когда нужно сориентироваться на острове',
}

const classPY = 'py-10 max-md:py-6'

export default function HelpPage() {
  return (
    <div className="container">
      {/* Hero блок */}
      <Hero
        dataHero={HELP_DATA}
        thisHeader={false}
        classes={{
          container: `${classPY}`,
        }}
      />

      {/* Блок "Нужно срочно?" */}
      <UrgentHelpBlock containerClass={classPY} />
    </div>
  )
}
