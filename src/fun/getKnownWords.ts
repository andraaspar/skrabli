import { loadAllWordsValidityFromDb } from './loadAllWordsValidityFromDb'

export async function getKnownWords() {
	const validity = await loadAllWordsValidityFromDb()
	const { KNOWN_WORDS } = await import('../model/KNOWN_WORDS')
	return KNOWN_WORDS.filter(
		(word) => !validity.invalidWords.includes(word),
	).concat(validity.validWords)
}
