import type { Field } from 'payload'

export const linkTypeField: Field = {
  name: 'linkType',
  type: 'select',
  label: 'Тип ссылки',
  required: true,
  options: [
    { label: '📁 Раздел', value: 'section' },
    { label: '📂 Подраздел', value: 'subsection' },
    { label: '📄 Статья', value: 'article' },
    { label: '🔗 Внешняя ссылка', value: 'external' },
  ],
}

export const linkRelationshipFields: Field[] = [
  {
    name: 'section',
    type: 'relationship',
    relationTo: 'sections',
    label: 'Раздел',
    admin: {
      condition: (_, sibling) => sibling?.linkType === 'section',
      description: 'Выберите раздел сайта (например: "Когда ехать", "На острове")',
    },
  },
  {
    name: 'subsection',
    type: 'relationship',
    relationTo: 'subsections',
    label: 'Подраздел',
    admin: {
      condition: (_, sibling) => sibling?.linkType === 'subsection',
      description: 'Выберите подраздел (например: "Сезоны", "Погода")',
    },
  },
  {
    name: 'article',
    type: 'relationship',
    relationTo: 'Articles',
    label: 'Статья',
    admin: {
      condition: (_, sibling) => sibling?.linkType === 'article',
      description: 'Выберите конкретную статью',
    },
  },
  {
    name: 'externalUrl',
    type: 'text',
    label: 'Внешний URL',
    admin: {
      condition: (_, sibling) => sibling?.linkType === 'external',
      description: 'Полный URL внешнего ресурса. Например: https://example.com',
    },
  },
]

export function createLinkField(name: string, label: string, defaultLabel?: string): Field {
  return {
    name,
    type: 'group',
    label,
    fields: [
      {
        name: 'label',
        type: 'text',
        label: 'Текст ссылки',
        required: true,
        maxLength: 100,
        defaultValue: defaultLabel,
      },
      linkTypeField,
      ...linkRelationshipFields,
    ],
  }
}

export const navigationIconOptions = [
  { label: '🗺️ Карта', value: 'Map' },
  { label: '✈️ Самолёт', value: 'Plane' },
  { label: '🏨 Отель', value: 'Hotel' },
  { label: '🍴 Еда', value: 'UtensilsCrossed' },
  { label: '📍 Местоположение', value: 'MapPin' },
  { label: '🚗 Транспорт', value: 'Car' },
  { label: '💰 Деньги', value: 'DollarSign' },
  { label: '💡 Советы', value: 'Lightbulb' },
  { label: '🛟 Помощь', value: 'LifeBuoy' },
  { label: '📋 Список', value: 'List' },
  { label: '⭐ Избранное', value: 'Star' },
  { label: '📅 Календарь', value: 'Calendar' },
  { label: '🌊 Волны', value: 'Waves' },
  { label: '🌴 Пальма', value: 'Palmtree' },
  { label: '📸 Фото', value: 'Camera' },
  { label: '🎒 Рюкзак', value: 'Backpack' },
]
