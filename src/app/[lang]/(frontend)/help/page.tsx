import Hero from '@/components/readyBlock/Hero'
import CardGridSection from '@/dataPage/helpDataPage/CardGridSection'
import ChecklistSection from '@/dataPage/helpDataPage/ChecklistSection'
import FaqSection from '@/dataPage/helpDataPage/FaqSection'
import { buildMetadata } from '@/lib/seo/metadata'
import { WebPageStructuredData } from '@/components/seo/StructuredData'
import { siteUrl } from '@/lib/seo/config'
import { withLocale } from '@/lib/locale'
import { getHelpPage } from '@/lib/payload/globals'
import { transformHelpPage, type TransformedHelpPageData } from '@/lib/transformData/helpPageTransform'
import type { Metadata } from 'next'
import UrgentHelpSection from '@/dataPage/helpDataPage/UrgentHelpSection'

export const revalidate = 30

export async function generateStaticParams() {
  return [{ lang: 'ru' }, { lang: 'en' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return buildMetadata({
    title: lang === 'en' ? 'Help in Phu Quoc' : 'Помощь на Фукуоке',
    description: lang === 'en' ? 'Quick answers and useful services' : 'Быстрые ответы и полезные сервисы',
    path: withLocale('/help', lang || 'ru'),
    locale: lang,
  })
}

const classPY = 'py-10 max-md:py-6'

export default async function HelpPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  let data: TransformedHelpPageData | null = null
  try {
    const raw = await getHelpPage(lang || 'ru')
    data = transformHelpPage(raw, lang || 'ru')
  } catch {
    data = null
  }

  if (!data) {
    const fallbackTitle = lang === 'en' ? 'Help in Phu Quoc' : 'Помощь на Фукуоке'
    const fallbackDesc = lang === 'en' ? 'Quick answers and useful services' : 'Быстрые ответы и полезные сервисы'
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold text-[#0A5D56]">{fallbackTitle}</h1>
        <p className="text-gray-600 mt-4">{fallbackDesc}</p>
      </div>
    )
  }

  return (
    <>
      <WebPageStructuredData
        title={data.heroData.title}
        description={data.heroData.description || ''}
        siteUrl={`${siteUrl}${lang === 'en' ? '/en' : ''}/help`}
      />
      <div className="container">
        <Hero
          dataHero={data.heroData}
          thisHeader={false}
          locale={lang || 'ru'}
          classes={{ container: classPY }}
        />

        <UrgentHelpSection locale={lang || 'ru'} />

        <CardGridSection
          title={data.urgentSection.title}
          cards={data.urgentSection.cards}
          columns={2}
          containerClass={classPY}
        />

        <CardGridSection
          title={data.whatHappenedSection.title}
          cards={data.whatHappenedSection.cards}
          columns={3}
          containerClass={classPY}
        />

        <FaqSection
          containerClass={classPY}
          items={data.faqSection.items}
          title={data.faqSection.title}
          locale={lang || 'ru'}
        />

        {data.cardBlock1.cards.length > 0 && (
          <CardGridSection
            title={data.cardBlock1.title}
            cards={data.cardBlock1.cards}
            columns={2}
            containerClass={classPY}
          />
        )}

        {data.cardBlock2.items.length > 0 && (
          <ChecklistSection
            title={data.cardBlock2.title}
            items={data.cardBlock2.items}
            badge={data.cardBlock2.badge}
            positiveTitle={data.cardBlock2.positiveTitle}
            warningTitle={data.cardBlock2.warningTitle}
            containerClass={classPY}
          />
        )}
      </div>
    </>
  )
}
