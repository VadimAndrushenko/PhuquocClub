import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',

  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        id: {
          equals: user.id,
        },
      }
    },
    create: ({ req }) => {
      if (!req.user) return false
      return req.user.role === 'admin'
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        id: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin'
    },
  },

  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'createdAt'],
    description: 'Пользователи админ-панели. Администраторы могут управлять всеми пользователями. Редакторы могут редактировать контент.',
  },

  auth: {
    tokenExpiration: 7200,
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600 * 1000,
  },

  fields: [
    {
      name: 'role',
      type: 'select',
      label: 'Роль',
      required: true,
      defaultValue: 'user',
      options: [
        { label: '🔑 Администратор', value: 'admin' },
        { label: '✏️ Редактор', value: 'editor' },
        { label: '👤 Пользователь', value: 'user' },
      ],
      admin: {
        description: 'Роль определяет права доступа: админ — полный доступ, редактор — управление контентом, пользователь — ограниченный доступ.',
      },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Имя',
      maxLength: 100,
      admin: {
        description: 'Отображаемое имя пользователя (необязательно).',
      },
    },
  ],
}
