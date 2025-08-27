import type { FieldAccess } from 'payload'
import { checkRole } from './roles/checkRole'

// admin only
export const adminField: FieldAccess = ({ req: { user } }) => checkRole(['admin'], user)

// admins or editors
export const adminsOrEditorsField: FieldAccess = ({ req: { user } }) =>
  checkRole(['admin', 'editor'], user)

// authenticated (remove?)
export const authenticatedField: FieldAccess = ({ req: { user } }) => Boolean(user)
