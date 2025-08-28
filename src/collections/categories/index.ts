import { CollectionConfig } from 'payload'
import { admins, adminsOrEditors, selfOrAdmin, authenticated } from '@/access'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: adminsOrEditors,
    read: authenticated,
    update: selfOrAdmin,
    delete: admins,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      localized: true,
      required: false,
    },
  ],
}
