import type { IDBPDatabase } from 'idb'
import type { ISkrabliDbSchema } from '../db/ISkrabliDbSchema'
import { openSkrabliDb } from '../db/openSkrabliDb'
import type { IWordsValidity } from '../model/IWordsValidity'

export async function storeAllWordsValidityToDb(
	validity: IWordsValidity,
): Promise<void> {
	let db: IDBPDatabase<ISkrabliDbSchema> | undefined = undefined
	try {
		db = await openSkrabliDb()
		db.put('validity', validity, 'it')
	} catch (e) {
		console.error(`[rxw93m]`, e)
	} finally {
		db?.close()
	}
}
