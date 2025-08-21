import type { CollectionConfig } from 'payload'
import { admins } from '@/access/admin'
import { adminsAndUsers } from '@/access/adminsAndUsers'
import { checkRole } from '@/access/checkRole'
import { protectedRoles } from './hooks/protectedRoles'
import { adminsField } from '@/access/fields/admin'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 28800,
    cookies: {
      sameSite: 'None',
      secure: false, // true in prod
      domain: process.env.COOKIE_DOMAIN,
    },
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: adminsAndUsers,
    create: admins,
    update: admins,
    delete: admins,
    unlock: admins,
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },

    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      access: {
        read: adminsField,
        update: adminsField,
        create: adminsField,
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
          label: 'User',
          value: 'user',
        },
      ],
    },
  ],
  timestamps: true,
}
