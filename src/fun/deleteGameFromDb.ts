import type { ISkrabliDbSchema } from '@/db/ISkrabliDbSchema'
import { openSkrabliDb } from '@/db/openSkrabliDb'
import { LocalStorageKey } from '@/model/LocalStorageKey'
import type { IDBPDatabase } from 'idb'

export async function deleteGameFromDb(gameId: string): Promise<void> {
	let db: IDBPDatabase<ISkrabliDbSchema> | undefined = undefined
	try {
		db = await openSkrabliDb()
		await db.delete('games', gameId)
		try {
			if (localStorage[LocalStorageKey.LastGameId] === gameId) {
				localStorage.removeItem(LocalStorageKey.LastGameId)
			} /*  else {
				console.warn(`[ryb0sr]`, {
					gameId,
					LastGameId: localStorage[LocalStorageKey.LastGameId],
				})
			} */
		} catch (e) {
			// Ignore error
		}
	} catch (e) {
		console.error(`[ryazbw]`, e)
	} finally {
		db?.close()
	}
}
