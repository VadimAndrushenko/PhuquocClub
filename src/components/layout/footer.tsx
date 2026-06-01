import Link from "next/link"
import Image from 'next/image';
import Logo from "../ui/Logo"
import FooterNavSection from "../ui/FooterNavSection"

export const socialItems = [
  {
    href: "https://youtube.com",
    label: "YouTube",
    icon: "/svg/youtube.svg",
  },

  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: "/svg/instagram.svg",
  },

  {
    href: "https://telegram.org",
    label: "Telegram",
    icon: "/svg/telegram.svg",
  },
]

const footerNavSections = {
  Планирование: [
    { href: '/before-trip/when-to-go', label: 'Когда ехать' },
    { href: '/before-trip/visa', label: 'Виза' },
    { href: '/before-trip/budget', label: 'Бюджет' },
    { href: '/before-trip/how-to-get', label: 'Как добраться' },
    { href: '/before-trip/insurance', label: 'Страховка' },
  ],

  "На острове": [
    { href: '/accommodation', label: 'Жильё' },
    { href: '/food', label: 'Еда' },
    { href: '/transport', label: 'Транспорт' },
    { href: '/on-island/beaches', label: 'Пляжи' },
    { href: '/on-island/entertainment', label: 'Развлечения' },
  ],

  Практика: [
    { href: '/prices', label: 'Деньги' },
    { href: '/practical/internet', label: 'Связь и интернет' },
    { href: '/practical/pharmacy', label: 'Аптеки и медицина' },
    { href: '/shops', label: 'Магазины' },
    { href: '/practical/safety', label: 'Безопасность' },
  ],

  Маршруты: [
    { href: '/routes/1-day', label: 'Маршруты на 1 день' },
    { href: '/routes/3-days', label: 'Маршруты на 3 дня' },
    { href: '/routes/7-days', label: 'Маршруты на 7 дней' },
    { href: '/routes/north', label: 'Север острова' },
    { href: '/routes/south', label: 'Юг острова' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-background mt-20 border-t border-black/5">
      <div className="container py-12">

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo />

            <p className="mt-3 text-sm leading-6 text-paragraph">
              Практичный гид по жизни и отдыху на острове Фукуок.
              Актуальная информация, проверенные места и полезные
              советы для туристов и экспатов.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-4 mt-7">
              {socialItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  className="transition-all duration-300 hover:-translate-y-1 hover:scale-120"
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={32}
                    height={32}
                    unoptimized={process.env.NODE_ENV === 'development'}
                  />
                </Link>
              ))}
            </div>
          </div>

          {Object.entries(footerNavSections).map(([title, items]) => (
            <FooterNavSection
              key={title}
              title={title}
              items={items}
            />
          ))}
        </div>

        <div className="border-t border-[#e2e8f0] mb-8 mt-16"/>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#90A1B9] text-xs">

          <p className="text-center md:text-left">
            © 2026 Phuquoc Club — Все права защищены
          </p>

          <div className="flex items-center flex-wrap gap-4 max-md:border-t max-md:border-[#e2e8f0] max-sm:gap-2.5 text-nowrap max-sm:justify-center">
            <Link href="/about" className="">
              О проекте
            </Link>

            <Link href="/contacts" className="">
              Реклама
            </Link>

            <Link href="/contacts" className="">
              Контакты
            </Link>
            
            <Link href="/privacy" className="">
              Политика конфиденциальности
            </Link>
          </div>

        </div>

      </div>
    </footer>
  )
}