import type { Block } from 'payload'

export const QuoteBlock: Block = {
  slug: 'quote',
  labels: { singular: 'Quote', plural: 'Quotes' },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      localized: true,
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      localized: true,
    },
    {
      name: 'source',
      type: 'text',
      admin: { description: 'URL or source' },
    },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'left',
      options: ['left', 'center'],
    },
  ],
}
