import type { TDB } from '@/db/TDB'
import { openSkrabliDb } from '@/db/openSkrabliDb'
import { LocalStorageKey } from '@/model/LocalStorageKey'
import type { TGameInfo } from '@/model/TGameInfo'
import { isString } from './isString'

export async function loadLastGameInfo(): Promise<TGameInfo | undefined> {
	const lastGameId = localStorage[LocalStorageKey.LastGameId]
	if (!isString(lastGameId)) return undefined
	let db: TDB | undefined = undefined
	try {
		db = await openSkrabliDb()
		const game = await db.get('games', lastGameId)
		if (game) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { states, ...gameInfo } = game
			return gameInfo
		} else {
			return undefined
		}
	} catch (e) {
		console.error(`[ry5f5h]`, e)
		return undefined
	} finally {
		db?.close()
	}
}
