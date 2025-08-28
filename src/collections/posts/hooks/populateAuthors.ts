// import type { CollectionAfterReadHook, CollectionBeforeValidateHook } from 'payload'
import { CollectionBeforeChangeHook } from 'payload'
import { User } from '@/payload-types'

export const populateAuthors: CollectionBeforeChangeHook = async ({ req, data, originalDoc }) => {
  const payload = req.payload

  const raw = (data?.authors ?? originalDoc?.authors) as (string | { id: string })[] | undefined
  const authorIDs = raw?.map((a) => (typeof a === 'object' ? a.id : a)).filter(Boolean) ?? []

  const populated: Array<{ authorId: string; fullName?: string | null }> = []

  for (const id of authorIDs) {
    try {
      const u = (await payload.findByID({
        collection: 'users',
        id,
        depth: 0, // no relations
      })) as User

      populated.push({
        authorId: String(u.id),
        fullName: (u as any).fullName ?? (u as any).name ?? u.email ?? null,
      })
    } catch {
      // ignore (e)
    }
  }
  return { ...data, populatedAuthors: populated }
}
