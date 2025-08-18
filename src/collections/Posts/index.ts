import type { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  defaultRichTextValue,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateDelete, revlidatePost } from './hooks/revalidatePost'
import { populateAuthors } from './hooks/populateAuthors'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  labels: { singular: 'Post', plural: 'Posts' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },

  // hooks : {},

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
          admin: { width: '40%', description: 'Autogenerate from title (replaceable)' },
        },
      ],
    },

    // Tabs - Image / Content / Relationship / META/SEO
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Media',
          description: 'Upload or Select image and/or other media to post.',
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
                    // BlocksFeature({blocks: [Banner, Code, MediaBlock]}),
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
          label: 'Relationship',
          description: 'Add related posts and/or categories.',
          fields: [
            {
              name: 'relatedPosts',
              type: 'relationship',
              localized: true,
              admin: { position: 'sidebar' },
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
              admin: { position: 'sidebar' },
              relationTo: 'categories',
              hasMany: true,
              required: true,
            },
          ],
        },

        /*         { 
            label: 'SEO', 
            description: 'Add META/SEO options', 
            fields: [
                {},
                {},
            ] 
        }, */
      ],
    },

    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
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

    // remove 'authors' and only use populatedAuthors
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },

    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    // ...slugField()
  ],
  hooks: {
    afterChange: [revlidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  /*   versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  }, */
}
