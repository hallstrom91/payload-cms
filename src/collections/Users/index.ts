import type { CollectionConfig } from 'payload'
import { protectedRoles } from './hooks/protectedRoles'
import { admins, selfOrAdmin } from '@/access/roles'
import { adminField } from '@/fields/admin'
import { checkRole } from '@/access/checkRole'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: false,
    tokenExpiration: 28800, // 8h
    cookies: {
      sameSite: 'None',
      secure: false,
    },
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: admins,
    read: selfOrAdmin,
    update: selfOrAdmin,
    delete: admins,
    unlock: admins,
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
    },

    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      defaultValue: ['user'],
      access: {
        // read: adminField, // fix so user can see roles correct
        update: adminField,
        create: adminField,
      },
      hooks: {
        beforeChange: [protectedRoles],
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
    },
  ],
  timestamps: true,
}
