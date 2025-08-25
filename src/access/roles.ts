import type { Access } from 'payload'
import { checkRole } from './checkRole'

// admin-role access only
export const admins: Access = ({ req: { user } }) => checkRole(['admin'], user)

// admin and/or editor-role access only
export const adminsOrEditors: Access = ({ req: { user } }) => checkRole(['admin', 'editor'], user)

// admin-role full-access, editor-role self-related-access
export const selfOrAdmin: Access = ({ req: { user }, id }) => {
  if (!user) return false

  const isAdmin = checkRole(['admin'], user)
  const isEditor = checkRole(['editor'], user)

  if (!isAdmin && !isEditor) return false
  if (isAdmin) return true

  if (id) return String(user.id) === String(id)

  return { id: { equals: user.id } }
}
