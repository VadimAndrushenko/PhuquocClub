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

export interface FooterProps {
  description?: string
  socialLinks?: SocialLinks
  navigationSections?: FooterNavSection[]
  additionalLinks?: AdditionalLink[]
}

export function Footer({
  description,
  socialLinks,
  navigationSections,
  additionalLinks,
  locale = 'ru',
}: FooterProps & { locale?: string }) {
  const sections = (navigationSections || [])

  return (
    <footer className="bg-background mt-20 border-t border-black/5">
      <div className="container py-12">

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo locale={locale} />

            {description && (
              <p className="mt-3 text-sm leading-6 text-paragraph whitespace-pre-line">
                {description}
              </p>
            )}

            {/* Socials */}
            <div className="flex items-center gap-4 mt-7">
              {socialLinks?.telegram && (
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
              {socialLinks?.instagram && (
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
              {socialLinks?.youtube && (
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
            © 2026 Phuquoc Club — {locale === 'en' ? 'All rights reserved' : 'Все права защищены'}
          </p>

          <div className="flex items-center flex-wrap gap-4 max-md:border-t max-md:border-[#e2e8f0] max-sm:gap-2.5 text-nowrap max-sm:justify-center">
            {(additionalLinks || []).map((link) => (
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