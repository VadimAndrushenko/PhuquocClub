// Run: node --env-file=.env seed-help.mjs
import { getPayload } from 'payload'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function seed() {
  process.env.NODE_ENV = 'development'

  const payload = await getPayload({
    config: (await import('./payload.config.ts')).default,
  })

  try {
    await payload.updateGlobal({
      slug: 'helpPage',
      data: {
        status: 'published',
        hero: {
          title: 'Помощь на Фукуоке',
          description: 'Быстрые ответы и полезные сервисы, когда нужно сориентироваться на острове',
          intro: 'Такси, аптеки, интернет, магазины, медицина, документы, безопасность и частые вопросы туристов — собрали всё, что может понадобиться во время поездки.',
          searchPlaceholder: 'Что найти: такси, аптека, SIM-карта, врач, магазин...',
          searchTags: [
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
        urgentSection: {
          title: 'Срочно нужно',
          cards: [
            { icon: 'Car', label: 'Такси', description: 'Как заказать машину, какие приложения работают и сколько примерно стоит поездка.', link: { label: 'Найти такси', linkType: 'external', externalUrl: '/help/taxi' } },
            { icon: 'Pill', label: 'Аптека', description: 'Где искать аптеки, как объяснить проблему и что взять с собой.', link: { label: 'Найти аптеку', linkType: 'external', externalUrl: '/help/pharmacy' } },
            { icon: 'Wifi', label: 'Интернет', description: 'SIM-карты, eSIM, мобильный интернет и Wi-Fi на острове.', link: { label: 'Подключиться', linkType: 'external', externalUrl: '/help/internet' } },
            { icon: 'ShoppingBag', label: 'Магазины', description: 'Супермаркеты, рынки, товары первой необходимости и график работы.', link: { label: 'Смотреть магазины', linkType: 'external', externalUrl: '/help/shops' } },
          ],
        },
        whatHappenedSection: {
          title: 'Что случилось?',
          cards: [
            { icon: 'FileText', label: 'Потеряли документы', description: 'Что проверить, где искать копии и куда обращаться дальше.', link: { label: 'Что делать', linkType: 'external', externalUrl: '/help/documents-lost' } },
            { icon: 'Stethoscope', label: 'Нужен врач', description: 'Как найти клинику, аптеку или помощь рядом.', link: { label: 'Что делать', linkType: 'external', externalUrl: '/help/doctor' } },
            { icon: 'WifiOff', label: 'Нет интернета', description: 'Где купить SIM, как подключить eSIM и что проверить в телефоне.', link: { label: 'Что делать', linkType: 'external', externalUrl: '/help/no-internet' } },
            { icon: 'Plane', label: 'Не можете уехать', description: 'Такси, трансфер, байк, аренда авто и варианты маршрута.', link: { label: 'Что делать', linkType: 'external', externalUrl: '/help/cant-leave' } },
            { icon: 'Wallet', label: 'Нужно обменять деньги', description: 'Где менять, как сравнить курс и на что обратить внимание.', link: { label: 'Что делать', linkType: 'external', externalUrl: '/help/exchange' } },
            { icon: 'Map', label: 'Нужен совет по району', description: 'Где жить, куда поехать, где поесть и какие пляжи выбрать.', link: { label: 'Что делать', linkType: 'external', externalUrl: '/help/districts' } },
          ],
        },
        faqSection: {
          title: 'Популярные вопросы',
          items: [
            { question: 'Как вызвать такси на Фукуоке?', answer: 'Самый удобный способ — использовать приложение Grab или Xanh SM. Также можно попросить вызвать такси на ресепшене отеля.' },
            { question: 'Где купить SIM-карту или eSIM?', answer: 'SIM-карты можно купить в аэропорту, в магазинах электроники, у уличных продавцов или в офисах операторов (Viettel, Vinaphone, Mobifone). eSIM поддерживают не все операторы.' },
            { question: 'Где найти аптеку рядом?', answer: 'Аптеки (nhà thuốc) есть в каждом районе. Ищите зелёный крест или спрашивайте в отеле. Многие фармацевты говорят по-английски.' },
            { question: 'Что делать, если потерял паспорт?', answer: 'Сначала обратитесь в полицию за справкой о потере. Затем свяжитесь с посольством или консульством вашей страны для получения временного документа.' },
            { question: 'Можно ли платить картой?', answer: 'В крупных магазинах, ресторанах и отелях принимают карты Visa и Mastercard. На рынках и в мелких лавках нужна наличка.' },
            { question: 'Где менять деньги?', answer: 'Выгоднее всего менять в ювелирных магазинах или золотых лавках. Также можно в банках (нужен паспорт) или в аэропорту (курс менее выгодный).' },
            { question: 'Как понять, в каком районе лучше жить?', answer: 'Для пляжного отдыха — Лонг Бич или Онг Ланг. Для спокойствия — Бай Сао или Бай Кхе. Для тусовок — Лонг Бич (север). Для семей — Бай Тру.' },
            { question: 'Куда обратиться, если нужна медицинская помощь?', answer: 'Для экстренных случаев звоните 115. Частные клиники: Vinmec, Family Hospital, Hoan My. Для простых случаев подойдут местные клиники.' },
          ],
        },
        cardBlock1: {
          title: 'Полезные сервисы',
          cards: [
            { icon: 'Car', label: 'Grab', description: 'Приложение для вызова такси и доставки еды.', link: { label: 'Скачать', linkType: 'external', externalUrl: 'https://grab.com' } },
            { icon: 'Map', label: 'Google Maps', description: 'Навигация и поиск мест на острове.', link: { label: 'Открыть', linkType: 'external', externalUrl: 'https://maps.google.com' } },
          ],
        },
        cardBlock2: {
          title: 'Что проверить перед поездкой',
          items: [
            { text: 'Оформить страховку', type: 'positive' },
            { text: 'Скачать Grab заранее', type: 'positive' },
            { text: 'Проверить срок действия паспорта', type: 'positive' },
            { text: 'Купить SIM-карту или eSIM', type: 'warning' },
            { text: 'Взять наличные (не везде принимают карты)', type: 'warning' },
            { text: 'Проверить визовые требования', type: 'warning' },
          ],
        },
      },
    })
    console.log('✅ HelpPage seeded successfully')
  } catch (e) {
    console.error('❌ Seeding failed:', e.message)
  }

  await payload.db.destroy()
  process.exit(0)
}

seed()
