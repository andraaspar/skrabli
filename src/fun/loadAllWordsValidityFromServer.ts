import { storeAllWordsValidityToDb } from './storeAllWordsValidityToDb'

let currentLoad: Promise<void> | undefined

export function loadAllWordsValidityFromServer() {
	if (currentLoad) return currentLoad
	return (currentLoad = load().finally(() => {
		currentLoad = undefined
	}))
}

async function load() {
	const response = await fetch(
		`https://api.github.com/gists/41d9c22f86c827648ba3c0d3dc7b3e01`,
	)
	if (!response.ok) {
		throw new Error(
			`[rxw9wy] Request error: ${response.status} ${response.statusText}`,
		)
	}
	const json: { files: { 'words.txt': { content: string } } } =
		await response.json()
	await storeAllWordsValidityToDb({
		validWords: json.files['words.txt'].content.split(/\n/g).filter(Boolean),
		invalidWords: [],
	})
}
