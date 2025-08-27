import { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const YouTubeBlock: Block = {
  slug: 'youtubeBlock',
  interfaceName: 'YouTube Block',
  labels: {
    singular: 'YouTube Block',
    plural: 'YouTube Blocks',
  },
  fields: [
    {
      name: 'videoId',
      type: 'text',
      label: 'YouTube Block',
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      label: 'Description (optional)',
      required: false,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures]
        },
      }),
    },
  ],
}
