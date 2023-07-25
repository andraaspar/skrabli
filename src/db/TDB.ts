import type { IDBPDatabase } from 'idb'
import type { ISkrabliDbSchema } from './ISkrabliDbSchema'

export type TDB = IDBPDatabase<ISkrabliDbSchema>
