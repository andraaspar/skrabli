import { TSetStateReducer } from '../model/TSetStateReducer'
import { getMoveScore } from '../select/getMoveScore'

export function score(): TSetStateReducer {
	return ({ players, playerIndex, board }) => {
		const player = players[playerIndex!]
		return {
			players: [
				...players.slice(0, playerIndex!),
				{ ...player, score: player.score + getMoveScore(board) },
				...players.slice(playerIndex! + 1),
			],
		}
	}
}
