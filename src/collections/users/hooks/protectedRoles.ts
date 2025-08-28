import type { FieldHook } from 'payload'
import { User } from '@/payload-types'
import { ENV } from '@/env'

export const protectedRoles: FieldHook<{ id: string } & User> = ({ data, req }) => {
  const isAdmin = req?.user?.roles?.includes('admin') || data?.email === ENV.SEED_ADMIN_EMAIL //  seed script

  if (!isAdmin) {
    return ['user']
  }

  const userRoles = new Set(data?.roles || [])
  userRoles.add('user')
  return [...userRoles]
}
