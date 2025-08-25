import type { Payload } from 'payload'
import { ENV } from '@/env'

export async function seedAdminIfEmpty(payload: Payload) {
  try {
    const existing = await payload.find({
      collection: 'users',
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (existing?.docs?.length) return

    // seed options

    await payload.create({
      collection: 'users',
      depth: 0,
      overrideAccess: true, // !! critical
      context: { seed: true },
      data: {
        email: ENV.SEED_ADMIN_EMAIL,
        password: ENV.SEED_ADMIN_PASSWORD,
        fullName: 'SeedSuperUser',
        roles: ['admin'],
      },
      // disableVerificationEmail: true // if email-verification
    })

    payload.logger.info(`Seeded first admin user: ${ENV.SEED_ADMIN_EMAIL}`)
  } catch (e) {
    payload.logger.error(`Failed to seed first admin user`)
    if (e instanceof Error) {
      payload.logger.error(e.message)
      payload.logger.error(e.stack)
    } else {
      payload.logger.error(String(e))
    }
  }
}
