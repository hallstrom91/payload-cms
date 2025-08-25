import type { CollectionConfig } from 'payload'
import { admins, adminsOrEditors, selfOrAdmin } from '@/access/roles'
import { authenticated } from '@/access/authenticated'
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: adminsOrEditors,
    read: authenticated,
    update: selfOrAdmin,
    delete: admins,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      required: true,
    },

    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
  ],
  upload: {
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 300 },
      { name: 'square', width: 500, height: 500 },
      { name: 'small', width: 600 },
      { name: 'medium', width: 900 },
      { name: 'large', width: 1400 },
    ],
    // add storage adapter ??
  },
}
