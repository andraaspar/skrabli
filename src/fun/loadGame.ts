import type { TDB } from '@/db/TDB'
import { openSkrabliDb } from '@/db/openSkrabliDb'
import type { IGame } from '@/model/IGame'

export async function loadGame(id: string): Promise<IGame | undefined> {
	let db: TDB | undefined = undefined
	try {
		db = await openSkrabliDb()
		const game = await db.get('games', id)
		return game
	} catch (e) {
		console.error(`[ry5f5h]`, e)
	} finally {
		db?.close()
	}
}
