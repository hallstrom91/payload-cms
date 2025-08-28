import type { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { revalidateDelete, revlidatePost } from './hooks/revalidatePost'
import { populateAuthors } from './hooks/populateAuthors'
import {
  admins,
  adminsOrEditors,
  selfOrAdmin,
  //authenticated,
  adminField,
  adminsOrEditorsField,
} from '@/access'

import { CodeBlock, JSONBlock, QuoteBlock, MediaBlock } from '@/blocks'
import { enforceAuthor } from './hooks/defaultAuthor'

//import { setDefaultAuthor } from './hooks/defaultAuthor'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: adminsOrEditors,
    read: () => true,
    // read: authenticated,
    update: selfOrAdmin,
    delete: admins,
  },
  labels: { singular: 'Post', plural: 'Posts' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'populatedAuthors', 'publishedAt'],
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
      name: 'relatedPosts',
      type: 'relationship',
      localized: true,
      relationTo: 'posts',
      // filterOptions: ({ id }) => {
      //   return {
      //     id: {
      //       not_in: [id],
      //     },
      //   }
      // },
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
          type: 'relationship',
          hasMany: true,
          relationTo: 'users',
          required: true,
          access: {
            read: adminsOrEditorsField,
            create: adminsOrEditorsField,
            update: adminsOrEditorsField,
          },
          admin: {
            width: '100%',
            description: 'Autogenerate on create/update (if empty)',
          },
        },

        {
          name: 'populatedAuthors',
          type: 'array',
          access: {
            read: () => true,
            create: () => false,
            update: () => false,
          },
          admin: {
            hidden: true,
            readOnly: true,
          },
          fields: [
            {
              name: 'authorId',
              type: 'text',
            },
            {
              name: 'fullName',
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
    beforeValidate: [enforceAuthor],
    beforeChange: [populateAuthors],
    afterChange: [revlidatePost],
    afterDelete: [revalidateDelete],
    // beforeValidate: [setDefaultAuthor],
    //afterRead: [populateAuthors],
  },
}
