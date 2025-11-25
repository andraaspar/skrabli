import { loadAllWordsValidityFromDb } from './loadAllWordsValidityFromDb'
import { loadAllWordsValidityFromServer } from './loadAllWordsValidityFromServer'

export async function getKnownWords() {
	let validity = await loadAllWordsValidityFromDb()
	if (validity.validWords.length === 0) {
		await loadAllWordsValidityFromServer()
		validity = await loadAllWordsValidityFromDb()
	}
	return validity.validWords
}
