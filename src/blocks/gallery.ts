import type { Block } from 'payload'

export const ImageGallery: Block = {
  slug: 'imageGallery',
  labels: { singular: 'Image Gallery', plural: 'Image Gallery' },
  fields: [
    {
      name: 'images',
      type: 'array',
      required: true,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text' },
        { name: 'caption', type: 'text' },
      ],
    },
    // {name: 'layout', type: 'select', options: ['grid', 'masonry', 'carousel']}
  ],
}
