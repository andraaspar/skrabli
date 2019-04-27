import { createSelector } from 'reselect'
import { Mode } from '../model/Mode'
import { IPlayer } from '../model/Player'
import { IState } from '../model/State'
import {
	selectModeFromAppState,
	selectPlayersFromAppState,
} from './simpleSelectors'

export const selectWinnersFromAppState = createSelector(
	[selectPlayersFromAppState, selectModeFromAppState],
	(players, mode) => {
		if (mode !== Mode.Won) return []
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

export const selectWinnersFromState = (state: IState) =>
	selectWinnersFromAppState(state.app)
