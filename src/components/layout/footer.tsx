import Link from "next/link"
import Image from 'next/image';
import Logo from "../ui/Logo"
import FooterNavSection from "../ui/FooterNavSection"

export interface SocialLinks {
  telegram?: string | null
  instagram?: string | null
  youtube?: string | null
}

export interface AdditionalLink {
  id?: string | number
  title: string
  href: string
}

export interface FooterNavItem {
  label: string
  href: string
}

export interface FooterNavSection {
  title: string
  items: FooterNavItem[]
}

// Дефолтные соцсети
const defaultSocialLinks: SocialLinks = {
  telegram: 'https://t.me/phuquocclub',
  instagram: 'https://instagram.com',
  youtube: 'https://youtube.com',
}

// Дефолтное описание
const defaultDescription = `Практичный гид по жизни и отдыху на острове Фукуок.
Актуальная информация, проверенные места и полезные
советы для туристов и экспатов.`

// Дефолтные секции навигации
const defaultSections: FooterNavSection[] = [
  {
    title: 'Планирование',
    items: [
      { href: '/before-trip/when-to-go', label: 'Когда ехать' },
      { href: '/before-trip/visa', label: 'Виза' },
      { href: '/before-trip/budget', label: 'Бюджет' },
      { href: '/before-trip/how-to-get', label: 'Как добраться' },
      { href: '/before-trip/insurance', label: 'Страховка' },
    ],
  },
  {
    title: 'На острове',
    items: [
      { href: '/accommodation', label: 'Жильё' },
      { href: '/food', label: 'Еда' },
      { href: '/transport', label: 'Транспорт' },
      { href: '/collections', label: 'Подборки' },
      { href: '/on-island/beaches', label: 'Пляжи' },
      { href: '/on-island/entertainment', label: 'Развлечения' },
    ],
  },
  {
    title: 'Практика',
    items: [
      { href: '/prices', label: 'Деньги' },
      { href: '/practical/internet', label: 'Связь и интернет' },
      { href: '/practical/pharmacy', label: 'Аптеки и медицина' },
      { href: '/shops', label: 'Магазины' },
      { href: '/practical/safety', label: 'Безопасность' },
    ],
  },
  {
    title: 'Маршруты',
    items: [
      { href: '/routes/1-day', label: 'Маршруты на 1 день' },
      { href: '/routes/3-days', label: 'Маршруты на 3 дня' },
      { href: '/routes/7-days', label: 'Маршруты на 7 дней' },
      { href: '/routes/north', label: 'Север острова' },
      { href: '/routes/south', label: 'Юг острова' },
    ],
  },
]

// Дефолтные доп. ссылки
const defaultAdditionalLinks: AdditionalLink[] = [
  { id: 1, title: 'О проекте', href: '/about' },
  { id: 2, title: 'Реклама', href: '/contacts' },
  { id: 3, title: 'Контакты', href: '/contacts' },
  { id: 4, title: 'Политика конфиденциальности', href: '/privacy' },
]

export interface FooterProps {
  description?: string
  socialLinks?: SocialLinks
  navigationSections?: FooterNavSection[]
  additionalLinks?: AdditionalLink[]
}

export function Footer({
  description = defaultDescription,
  socialLinks = defaultSocialLinks,
  navigationSections,
  additionalLinks,
}: FooterProps) {
  const sections = navigationSections && navigationSections.length > 0 ? navigationSections : defaultSections
  const links = additionalLinks && additionalLinks.length > 0 ? additionalLinks : defaultAdditionalLinks

  return (
    <footer className="bg-background mt-20 border-t border-black/5">
      <div className="container py-12">

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo />

            <p className="mt-3 text-sm leading-6 text-paragraph whitespace-pre-line">
              {description}
            </p>

            {/* Socials */}
            <div className="flex items-center gap-4 mt-7">
              {socialLinks.telegram && (
                <Link
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-300 hover:-translate-y-1 hover:scale-120"
                >
                  <Image
                    src="/svg/telegram.svg"
                    alt="Telegram"
                    width={32}
                    height={32}
                    unoptimized={process.env.NODE_ENV === 'development'}
                  />
                </Link>
              )}
              {socialLinks.instagram && (
                <Link
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-300 hover:-translate-y-1 hover:scale-120"
                >
                  <Image
                    src="/svg/instagram.svg"
                    alt="Instagram"
                    width={32}
                    height={32}
                    unoptimized={process.env.NODE_ENV === 'development'}
                  />
                </Link>
              )}
              {socialLinks.youtube && (
                <Link
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-300 hover:-translate-y-1 hover:scale-120"
                >
                  <Image
                    src="/svg/youtube.svg"
                    alt="YouTube"
                    width={32}
                    height={32}
                    unoptimized={process.env.NODE_ENV === 'development'}
                  />
                </Link>
              )}
            </div>
          </div>

          {sections.map((section) => (
            <FooterNavSection
              key={section.title}
              title={section.title}
              items={section.items}
            />
          ))}
        </div>

        <div className="border-t border-[#e2e8f0] mb-8 mt-16"/>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#90A1B9] text-xs">

          <p className="text-center md:text-left">
            © 2026 Phuquoc Club — Все права защищены
          </p>

          <div className="flex items-center flex-wrap gap-4 max-md:border-t max-md:border-[#e2e8f0] max-sm:gap-2.5 text-nowrap max-sm:justify-center">
            {links.map((link) => (
              <Link key={link.id || link.title} href={link.href} className="">
                {link.title}
              </Link>
            ))}
          </div>

        </div>

      </div>
    </footer>
  )
}