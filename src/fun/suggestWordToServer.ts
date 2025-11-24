import type { TSuggestResponse } from '../model/TSuggestResponse'

export async function suggestWordToServer(
	word: string,
	suggest: boolean,
): Promise<TSuggestResponse> {
	const response = await fetch(`/skrabli/api/suggest-word`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ word, suggest }),
	})
	const json: TSuggestResponse | { error: string } = await response.json()
	if ('error' in json) {
		throw new Error(json.error + '')
	}
	if (!response.ok) {
		throw new Error(
			`[rxwauo] Request error: ${response.status} ${response.statusText}`,
		)
	}
	return json
}
