import { createSelector } from 'reselect'
import { Mode } from '../model/Mode'
import { IPlayer } from '../model/Player'
import { selectMode, selectPlayers } from './simpleSelectors'

export const selectWinners = createSelector(
	[selectPlayers, selectMode],
	(players, mode) => {
		if (mode !== Mode.Ended) return []
		let winningScore = -1
		let winners: IPlayer[] = []
		for (let player of players) {
			if (player.score > winningScore) {
				winningScore = player.score
				winners = [player]
			} else if (player.score === winningScore) {
				winners.push(player)
			}
		}
		return winners
	},
)
