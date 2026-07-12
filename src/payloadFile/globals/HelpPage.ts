import type { GlobalConfig } from 'payload'
import { linkTypeField, linkRelationshipFields } from '../utils/fields'

export const HelpPage: GlobalConfig = {
  slug: 'helpPage',
  label: '🆘 Страница помощи',

  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user,
  },

  versions: false,

  fields: [
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      options: [
        { label: '📝 Черновик', value: 'draft' },
        { label: '✅ Опубликовано', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: { position: 'sidebar' },
    },

    // === HERO ===
    {
      name: 'hero',
      type: 'group',
      label: '🎯 Hero (шапка)',
      admin: { description: 'Верхний блок страницы помощи: заголовок, описание и поиск.' },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Описание',
          localized: true,
        },
        {
          name: 'intro',
          type: 'textarea',
          label: 'Intro-текст',
          localized: true,
        },
        {
          name: 'searchPlaceholder',
          type: 'text',
          label: 'Плейсхолдер поиска',
          localized: true,
        },
        {
          name: 'searchTags',
          type: 'array',
          label: 'Теги поиска',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Текст тега',
              required: true,
            },
            {
              name: 'icon',
              type: 'select',
              label: 'Иконка',
              required: true,
              options: [
                { label: '🍴 Еда', value: 'utensilsCrossed' },
                { label: '🗺️ Достопримечательности', value: 'map' },
                { label: '🏖️ Пляжи', value: 'waves' },
                { label: '🚌 Транспорт', value: 'bus' },
                { label: '💰 Цены', value: 'dollarSign' },
                { label: '📄 Виза', value: 'fileText' },
                { label: '🛟 Помощь', value: 'lifeBuoy' },
              ],
              admin: { description: 'Иконка рядом с тегом.' },
            },
          ],
        },
      ],
    },

    // === URGENT SECTION ===
    {
      name: 'urgentSection',
      type: 'group',
      label: '⚡ Блок "Срочно нужно"',
      admin: { description: 'Карточки срочной помощи: такси, аптека, интернет, магазины.' },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок секции',
          localized: true,
          required: true,
        },
        {
          name: 'cards',
          type: 'array',
          label: 'Карточки',
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Иконка',
              required: true,
              options: [
                { label: '🚗 Такси', value: 'Car' },
                { label: '💊 Аптека', value: 'Pill' },
                { label: '📶 Интернет', value: 'Wifi' },
                { label: '🛒 Магазины', value: 'ShoppingBag' },
                { label: '🩺 Медицина', value: 'Phone' },
                { label: '📄 Документы', value: 'FileText' },
                { label: '🛡️ Безопасность', value: 'Shield' },
                { label: '❓ Помощь', value: 'HelpCircle' },
                { label: '🏥 Врач', value: 'Stethoscope' },
                { label: '📶 Нет интернета', value: 'WifiOff' },
                { label: '✈️ Отъезд', value: 'Plane' },
                { label: '💰 Деньги', value: 'Wallet' },
                { label: '🗺️ Районы', value: 'Map' },
              ],
            },
            {
              name: 'label',
              type: 'text',
              label: 'Заголовок карточки',
              localized: true,
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Описание',
              localized: true,
            },
            {
              name: 'link',
              type: 'group',
              label: 'Ссылка',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Текст ссылки',
                  required: true,
                },
                linkTypeField,
                ...linkRelationshipFields,
              ],
            },
          ],
        },
      ],
    },

    // === WHAT HAPPENED SECTION ===
    {
      name: 'whatHappenedSection',
      type: 'group',
      label: '❓ Блок "Что случилось?"',
      admin: { description: 'Ситуационные карточки: потеря документов, нужен врач, нет интернета и т.д.' },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок секции',
          localized: true,
          required: true,
        },
        {
          name: 'cards',
          type: 'array',
          label: 'Карточки',
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Иконка',
              required: true,
              options: [
                { label: '🚗 Такси', value: 'Car' },
                { label: '💊 Аптека', value: 'Pill' },
                { label: '📶 Интернет', value: 'Wifi' },
                { label: '🛒 Магазины', value: 'ShoppingBag' },
                { label: '🩺 Медицина', value: 'Phone' },
                { label: '📄 Документы', value: 'FileText' },
                { label: '🛡️ Безопасность', value: 'Shield' },
                { label: '❓ Помощь', value: 'HelpCircle' },
                { label: '🏥 Врач', value: 'Stethoscope' },
                { label: '📶 Нет интернета', value: 'WifiOff' },
                { label: '✈️ Отъезд', value: 'Plane' },
                { label: '💰 Деньги', value: 'Wallet' },
                { label: '🗺️ Районы', value: 'Map' },
              ],
            },
            {
              name: 'label',
              type: 'text',
              label: 'Заголовок карточки',
              localized: true,
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Описание',
              localized: true,
            },
            {
              name: 'link',
              type: 'group',
              label: 'Ссылка',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Текст ссылки',
                  required: true,
                },
                linkTypeField,
                ...linkRelationshipFields,
              ],
            },
          ],
        },
      ],
    },

    // === FAQ ===
    {
      name: 'faqSection',
      type: 'group',
      label: '❓ FAQ (Часто задаваемые вопросы)',
      admin: { description: 'Аккордеон с вопросами и ответами.' },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок секции',
          localized: true,
          required: true,
        },
        {
          name: 'items',
          type: 'array',
          label: 'Вопросы',
          fields: [
            {
              name: 'question',
              type: 'text',
              label: 'Вопрос',
              localized: true,
              required: true,
            },
            {
              name: 'answer',
              type: 'textarea',
              label: 'Ответ',
              localized: true,
              required: true,
            },
          ],
        },
      ],
    },

    // === CARD BLOCK 1 (card grid with links) ===
    {
      name: 'cardBlock1',
      type: 'group',
      label: '🃏 Блок карточек 1 (после FAQ)',
      admin: { description: 'Первый блок карточек после FAQ. Карточки с иконками и ссылками на разделы/статьи.' },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок секции',
          localized: true,
          required: true,
        },
        {
          name: 'cards',
          type: 'array',
          label: 'Карточки',
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Иконка',
              required: true,
              options: [
                { label: '🚗 Такси', value: 'Car' },
                { label: '💊 Аптека', value: 'Pill' },
                { label: '📶 Интернет', value: 'Wifi' },
                { label: '🛒 Магазины', value: 'ShoppingBag' },
                { label: '🩺 Медицина', value: 'Phone' },
                { label: '📄 Документы', value: 'FileText' },
                { label: '🛡️ Безопасность', value: 'Shield' },
                { label: '❓ Помощь', value: 'HelpCircle' },
                { label: '🏥 Врач', value: 'Stethoscope' },
                { label: '📶 Нет интернета', value: 'WifiOff' },
                { label: '✈️ Отъезд', value: 'Plane' },
                { label: '💰 Деньги', value: 'Wallet' },
                { label: '🗺️ Районы', value: 'Map' },
              ],
            },
            {
              name: 'label',
              type: 'text',
              label: 'Заголовок карточки',
              localized: true,
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Описание',
              localized: true,
            },
            {
              name: 'link',
              type: 'group',
              label: 'Ссылка',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Текст ссылки',
                  required: true,
                },
                linkTypeField,
                ...linkRelationshipFields,
              ],
            },
          ],
        },
      ],
    },

    // === CARD BLOCK 2 (checklist) ===
    {
      name: 'cardBlock2',
      type: 'group',
      label: '✅ Блок чек-листа 2 (после FAQ)',
      admin: { description: 'Две колонки: позитив (галочки) и предупреждения (треугольники).' },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок секции',
          localized: true,
          required: true,
        },
        {
          name: 'badge',
          type: 'text',
          label: 'Бейдж-плашка',
          localized: true,
          admin: { description: 'Небольшой цветной ярлык над контентом. Например: "Практично"' },
        },
        {
          name: 'positiveTitle',
          type: 'text',
          label: 'Заголовок колонки (позитив)',
          localized: true,
          admin: { description: 'Например: "Что нужно знать" или "Do\'s"' },
        },
        {
          name: 'warningTitle',
          type: 'text',
          label: 'Заголовок колонки (предупреждения)',
          localized: true,
          admin: { description: 'Например: "Чего избегать" или "Don\'ts"' },
        },
        {
          name: 'items',
          type: 'array',
          label: 'Пункты чек-листа',
          fields: [
            {
              name: 'text',
              type: 'textarea',
              label: 'Текст пункта',
              localized: true,
              required: true,
            },
            {
              name: 'type',
              type: 'select',
              label: 'Тип',
              required: true,
              defaultValue: 'positive',
              options: [
                { label: '✅ Позитивный (галочка)', value: 'positive' },
                { label: '⚠️ Предупреждение (треугольник)', value: 'warning' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
