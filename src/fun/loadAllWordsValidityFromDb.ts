import type { ISkrabliDbSchema } from '@/db/ISkrabliDbSchema'
import { openSkrabliDb } from '@/db/openSkrabliDb'
import type { IWordsValidity } from '@/model/IWordsValidity'
import type { IDBPDatabase } from 'idb'

export async function loadAllWordsValidityFromDb(): Promise<IWordsValidity> {
	let db: IDBPDatabase<ISkrabliDbSchema> | undefined = undefined
	try {
		db = await openSkrabliDb()
		const validity = await db.get('validity', 'it')
		if (!validity) throw new Error(`[rxw91t] No validity in DB.`)
		return validity
	} catch (e) {
		console.error(`[rxw8y5]`, e)
		return { validWords: [], invalidWords: [] }
	} finally {
		db?.close()
	}
}
