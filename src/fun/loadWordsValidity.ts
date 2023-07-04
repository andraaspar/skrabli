import { type IWordsValidity } from '../model/IWordsValidity'

export async function loadWordsValidity(
	words: string[],
): Promise<IWordsValidity> {
	const wordsToCheck = words
		.map((word) => word.trim())
		.filter((word) => word.length > 1)
	if (wordsToCheck.length === 0) {
		return {
			invalidWords: [],
			validWords: [],
		}
	}
	const response = await fetch(`/skrabli/api/are-words-valid`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ words: wordsToCheck }),
	})
	const json = await response.json()
	if ('error' in json && typeof json.error === 'string') {
		throw new Error(json.error)
	}
	if (!response.ok) {
		throw new Error(
			`[rwi45f] Request error: ${response.status} ${response.statusText}`,
		)
	}
	if (!Array.isArray(json.validWords) || !Array.isArray(json.invalidWords)) {
		throw new Error(`[rwi4ak] Invalid response format: ${JSON.stringify(json)}`)
	}
	return json
}
