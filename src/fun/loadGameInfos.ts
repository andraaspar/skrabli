import type { TDB } from '@/db/TDB'
import { openSkrabliDb } from '@/db/openSkrabliDb'
import type { TGameInfo } from '@/model/TGameInfo'

export async function loadGameInfos(): Promise<TGameInfo[]> {
	let db: TDB | undefined = undefined
	try {
		db = await openSkrabliDb()
		const gameInfos: TGameInfo[] = []
		const tx = db.transaction('games')
		for await (const cursor of tx.store
			.index('byTimestamp')
			.iterate(undefined, 'prev')) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { states, ...gameInfo } = cursor.value
			gameInfos.push(gameInfo)
		}
		return gameInfos
	} catch (e) {
		console.error(`[ry5f5h]`, e)
		return []
	} finally {
		db?.close()
	}
}
