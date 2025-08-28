// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users, Media, Categories, Posts } from './collections'
import { seedAdminIfEmpty } from './utils/seed'
import { ENV } from './env'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Categories, Posts],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || '',
    },
  }),
  sharp,

  localization: {
    locales: [
      { label: 'English', code: 'en' },
      {
        label: 'Swedish',
        code: 'sv',
      },
    ],
    defaultLocale: 'en', // required
    fallback: true,
  },

  cors: {
    origins: [ENV.NEXT_PUBLIC_CMS_URL, ENV.NEXT_PUBLIC_BLOG_URL],
    headers: ['Authorization'],
  },

  //csrf: [ENV.NEXT_PUBLIC_BLOG_URL, ENV.NEXT_PUBLIC_CMS_URL],

  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],

  onInit: async (payload) => {
    if (ENV.SEED_ENABLED) await seedAdminIfEmpty(payload)
  },
})
