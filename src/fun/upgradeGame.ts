import type { IGame, IGame1 } from '../model/IGame'
import { withInterface } from './withInterface'

export function upgradeGame(game: IGame | IGame1): IGame {
	if (!('version' in game)) {
		game = withInterface<IGame>({
			...game,
			version: 2,
			playerInfos: game.playerInfos.map((playerInfo) => ({
				...playerInfo,
				hints: 3,
			})),
		})
	}
	if ('version' in game) {
		switch (game.version) {
			case 2:
				return game
		}
	}
	throw new Error(`[ryly99] Could not upgrade game.`)
}
