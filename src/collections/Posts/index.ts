import type { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  // defaultRichTextValue,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { revalidateDelete, revlidatePost } from './hooks/revalidatePost'
import { populateAuthors } from './hooks/populateAuthors'

import { CodeBlock } from '@/blocks/Code'
import { JSONBlock } from '@/blocks/Json'
import { QuoteBlock } from '@/blocks/Quotes'
import { MediaBlock } from '@/blocks/Media'

import { admins, adminsOrEditors, selfOrAdmin } from '@/access/roles'
import { authenticated } from '@/access/authenticated'
import { adminField } from '@/fields/admin'
import { setDefaultAuthor } from './hooks/defaultAuthor'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: adminsOrEditors,
    read: authenticated,
    update: selfOrAdmin,
    delete: admins,
  },
  labels: { singular: 'Post', plural: 'Posts' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title'],
  },
  versions: {
    drafts: true,
  },

  fields: [
    // title & slug
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          maxLength: 120,
          required: true,
          admin: { width: '60%' },
        },

        {
          name: 'slug',
          type: 'text',
          localized: true,
          unique: true,
          admin: { width: '40%', description: 'Autogenerate from title' },
          access: {
            create: () => true,
            update: adminField, // only admin can update slug
            read: () => true,
          },
        },
      ],
    },

    // relations
    {
      // FIX: cant connect related published posts, only @ update
      name: 'relatedPosts',
      type: 'relationship',
      localized: true,
      relationTo: 'posts',
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
      hasMany: true,
    },

    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: true,
    },

    // author and publishedAt
    {
      type: 'row',
      fields: [
        {
          name: 'authors',
          //type: 'text',
          type: 'relationship',
          hasMany: true,
          relationTo: 'users',
          admin: {
            width: '100%',
          },
        },

        {
          name: 'populatedAuthors',
          type: 'array',
          access: {
            update: () => false,
            create: () => false,
            read: () => true,
          },
          admin: {
            hidden: true,
            disabled: true,
            readOnly: true,
          },
          fields: [
            {
              name: 'id',
              type: 'text',
            },
            {
              name: 'fullname',
              type: 'text',
            },
          ],
        },

        {
          name: 'publishedAt',
          type: 'date',
          admin: {
            date: { pickerAppearance: 'dayAndTime' },
            width: '30%',
          },
          hooks: {
            beforeChange: [
              ({ siblingData, value }) => {
                if (siblingData._status === 'published' && !value) {
                  return new Date()
                }
                return value
              },
            ],
          },
        },
      ],
    },

    // Tabs - Media / Content / Meta
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Media',
          description: 'Upload or Select image (main/hero)',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
          ],
        },

        {
          label: 'Content',
          description: 'Add main content to post here.',
          fields: [
            {
              name: 'content',
              type: 'richText',
              localized: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2'] }),
                    BlocksFeature({ blocks: [CodeBlock, JSONBlock, QuoteBlock, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: true,
            },
          ],
        },

        {
          label: 'Meta',
          description: 'Add META/SEO options - coming',
          fields: [{ name: 'text', type: 'text' }],
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [setDefaultAuthor],
    afterChange: [revlidatePost],
    // afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
}
