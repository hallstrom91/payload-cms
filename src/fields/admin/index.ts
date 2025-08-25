import type { FieldAccess } from 'payload'
import { checkRole } from '@/access/checkRole'

// field access - admin only
export const adminField: FieldAccess = ({ req: { user } }) => checkRole(['admin'], user)
