import { type IWordsValidity } from '../model/IWordsValidity'
import { getKnownWords } from './getKnownWords'

export async function loadWordsValidity(
	words: string[],
): Promise<IWordsValidity> {
	const knownValidWords = await getKnownWords()
	const invalidWords = new Set<string>()
	const validWords = new Set<string>()
	// const wordsToCheck = new Set<string>()
	for (const word of words) {
		if (word.length < 2) {
			console.warn(`[rxhewt] Not a word:`, word)
		} else if (word.includes(' ')) {
			console.log(`[rxhf5v] Word has blank joker:`, word)
			invalidWords.add(word)
		} else if (knownValidWords.includes(word)) {
			console.log(`[rxhf6r] Word is in list:`, word)
			validWords.add(word)
		}
		// else if (LETTERS.find((letter) => letter.letter === word)) {
		// 	console.log(`[rxhf75] Word is letter:`, word)
		// 	// Letters are not words
		// 	invalidWords.add(word)
		// } else {
		// 	console.log(`[rxhf7v] Word is to check:`, word)
		// 	wordsToCheck.add(word)
		// }
		else {
			invalidWords.add(word)
		}
	}
	// if (wordsToCheck.size > 0) {
	// 	const response = await fetch(`/skrabli/api/are-words-valid`, {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 		},
	// 		body: JSON.stringify({ words: Array.from(wordsToCheck) }),
	// 	})
	// 	const json = await response.json()
	// 	if ('error' in json && typeof json.error === 'string') {
	// 		throw new Error(json.error)
	// 	}
	// 	if (!response.ok) {
	// 		throw new Error(
	// 			`[rwi45f] Request error: ${response.status} ${response.statusText}`,
	// 		)
	// 	}
	// 	if (!Array.isArray(json.validWords) || !Array.isArray(json.invalidWords)) {
	// 		throw new Error(
	// 			`[rwi4ak] Invalid response format: ${JSON.stringify(json)}`,
	// 		)
	// 	}
	// 	json.validWords.forEach((word: string) => validWords.add(word))
	// 	json.invalidWords.forEach((word: string) => invalidWords.add(word))
	// }
	console.log(
		`[rxhezr]`,
		JSON.stringify({
			validWords: Array.from(validWords),
			invalidWords: Array.from(invalidWords),
		}),
	)
	return {
		validWords: Array.from(validWords),
		invalidWords: Array.from(invalidWords),
	}
}
