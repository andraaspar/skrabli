import type { IWordsValidity } from '@/model/IWordsValidity'
import { storeAllWordsValidityToDb } from './storeAllWordsValidityToDb'

export async function loadAllWordsValidityFromServer() {
	const response = await fetch(`/skrabli/api/all-word-validity`)
	const json: IWordsValidity | { error: string } = await response.json()
	if ('error' in json) {
		throw new Error(json.error + '')
	}
	if (!response.ok) {
		throw new Error(
			`[rxw9wy] Request error: ${response.status} ${response.statusText}`,
		)
	}
	if (!Array.isArray(json.validWords) || !Array.isArray(json.invalidWords)) {
		throw new Error(`[rxw9y0] Invalid response format.`)
	}
	await storeAllWordsValidityToDb(json)
}
