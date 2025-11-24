import { BOARD_SIZE } from '../model/Constants'
import type { IGameState1 } from '../model/IGameState'
import { LocalStorageKey } from '../model/LocalStorageKey'
import { gameState1ToGame } from './gameState1ToGame'
import { getNoError } from './getNoError'
import { storeGameToDb } from './storeGameToDb'

export async function migrateGameFromLocalStorage() {
	try {
		const gameFromLocalStorage = getNoError<IGameState1 | undefined>(
			undefined,
			() => JSON.parse(localStorage[LocalStorageKey._SavedGame]),
		)
		if (gameFromLocalStorage) {
			if (!gameFromLocalStorage.boardSize) {
				gameFromLocalStorage.boardSize = {
					width: BOARD_SIZE,
					height: BOARD_SIZE,
				}
			}
			const game = gameState1ToGame(gameFromLocalStorage)
			await storeGameToDb(game)
			localStorage.removeItem(LocalStorageKey._SavedGame)
			localStorage.setItem(LocalStorageKey.LastGameId, game.id)
		}
	} catch (e) {
		console.error(`[ry5hqd]`, e)
	}
}
