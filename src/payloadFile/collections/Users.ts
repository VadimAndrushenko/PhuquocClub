import type { CollectionConfig } from 'payload'

/**
 * ============================================
 * 📦 COLLECTION: Users
 * ============================================
 * Authentication-enabled collection
 * IMPORTANT: Read access restricted to authenticated users only
 */

export const Users: CollectionConfig = {
  slug: 'users',

  // 🔒 SECURITY: Restrict access
  access: {
    read: ({ req: { user } }) => {
      // Only authenticated users can read user data
      if (!user) return false
      
      // Users can only read their own data unless they are admin
      if (user.role === 'admin') return true
      
      return {
        id: {
          equals: user.id,
        },
      }
    },
    create: ({ req }) => {
      // Только админы могут создавать новых пользователей
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
  },

  auth: {
    tokenExpiration: 7200, // 2 hours
    verify: false, // Set to true if email verification needed
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 minutes
  },

  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
      admin: {
        description: 'User role determines permissions',
      },
    },
    {
      name: 'name',
      type: 'text',
      maxLength: 100,
      admin: {
        description: 'Optional: Display name',
      },
    },
  ],
}
