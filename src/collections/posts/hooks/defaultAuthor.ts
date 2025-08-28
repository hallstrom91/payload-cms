import type { CollectionBeforeValidateHook } from 'payload'
import type { User } from '@/payload-types'
// // import { Post } from '@/payload-types'
// import { adminsOrEditors } from '@/access'

const isAllowed = (u?: User | null) =>
  !!u && Array.isArray(u.roles) && (u.roles.includes('admin') || u.roles.includes('editor'))

export const enforceAuthor: CollectionBeforeValidateHook = async ({
  req,
  data,
  operation,
  originalDoc,
}) => {
  const user = req.user as User | undefined
  if (!user) return data

  const allowed = isAllowed(user)
  const incoming = data?.authors

  //const normalizeIDs = (val: any): (string | number)[] =>
  const normalizeIDs = (val: any): string[] =>
    Array.isArray(val)
      ? //? val.map((v) => (typeof v === 'object' ? v?.id : v)).filter(v => v != null)
        val.map((v) => (typeof v === 'object' ? v?.id : v)).filter(Boolean)
      : val
        ? //  : val != null
          [typeof val === 'object' ? val.id : val]
        : []

  if (operation === 'create') {
    if (!incoming || normalizeIDs(incoming).length === 0 || !allowed) {
      return { ...data, authors: [user.id] }
    }
    return data
  }

  if (operation === 'update') {
    if (!allowed) {
      const prev = normalizeIDs(originalDoc?.authors)
      return { ...data, authors: prev.length > 0 ? prev : [user.id] }
    }
    return data
  }
  return data
}
