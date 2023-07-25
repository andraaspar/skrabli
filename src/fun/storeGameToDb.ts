import type { ISkrabliDbSchema } from '@/db/ISkrabliDbSchema'
import { openSkrabliDb } from '@/db/openSkrabliDb'
import type { IGame } from '@/model/IGame'
import { LocalStorageKey } from '@/model/LocalStorageKey'
import type { IDBPDatabase } from 'idb'
import { jsonClone } from './jsonClone'

export async function storeGameToDb(game: IGame): Promise<void> {
	game = jsonClone(game)
	game.timestamp = Date.now()
	let db: IDBPDatabase<ISkrabliDbSchema> | undefined = undefined
	try {
		db = await openSkrabliDb()
		await db.put('games', game)
		localStorage[LocalStorageKey.LastGameId] = game.id
	} catch (e) {
		console.error(`[ry3w5e]`, e)
	} finally {
		db?.close()
	}
}
