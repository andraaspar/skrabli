import type { IGame } from '@/model/IGame'
import { LocalStorageKey } from '@/model/LocalStorageKey'
import { loadGame } from './loadGame'

export async function loadContinuableGame(): Promise<IGame | undefined> {
	const gameId = localStorage[LocalStorageKey.LastGameId]
	if (gameId) {
		const game = await loadGame(gameId)
		if (!game) throw new Error(`[ry5mal] Game not found!`)
		return game
	}
}
