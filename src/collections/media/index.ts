import type { CollectionConfig } from 'payload'
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import { admins, adminsOrEditors, selfOrAdmin, authenticated } from '@/access'
import { YouTubeBlock } from '@/blocks/youtube'

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

    {
      name: 'variant',
      type: 'blocks',
      required: false,
      maxRows: 1,
      blocks: [YouTubeBlock],
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
