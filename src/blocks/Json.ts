import type { Block } from 'payload'

export const JSONBlock: Block = {
  slug: 'json-block',
  labels: { singular: 'JSON', plural: 'JSON' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'data', type: 'json', required: true },
  ],
}
