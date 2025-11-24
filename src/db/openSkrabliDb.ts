import { openDB } from 'idb'
import type { ISkrabliDbSchema } from './ISkrabliDbSchema'

export function openSkrabliDb() {
	setTimeout(() => {
		navigator.storage.persist()
	})
	return openDB<ISkrabliDbSchema>('skrabli-db', 2, {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		upgrade(database, oldVersion, newVersion, transaction, event) {
			if (oldVersion < 1) {
				database.createObjectStore('validity')
			}
			if (oldVersion < 2) {
				const games = database.createObjectStore('games', {
					keyPath: 'id',
				})
				games.createIndex('byTimestamp', 'timestamp')
			}
		},
	})
}
