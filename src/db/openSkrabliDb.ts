import { openDB } from 'idb'
import type { ISkrabliDbSchema } from './ISkrabliDbSchema'

export function openSkrabliDb() {
	return openDB<ISkrabliDbSchema>('skrabli-db', 1, {
		upgrade(database, oldVersion, newVersion, transaction, event) {
			database.createObjectStore('validity')
		},
	})
}
