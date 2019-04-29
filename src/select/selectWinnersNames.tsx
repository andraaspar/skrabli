import { createSelector } from 'reselect'
import { IState } from '../model/State'
import { selectWinnersFromAppState } from './selectWinners'

export const selectWinnersNamesFromAppState = createSelector(
	[selectWinnersFromAppState],
	winners => {
		if (winners.length === 0) return ``
		const winnerNames = winners.map(winner => winner.name)
		const last = winnerNames[winnerNames.length - 1]
		const rest = winnerNames.slice(0, winnerNames.length - 1)
		return rest.length ? `${rest.join(', ')} és ${last}` : last
	},
)

export const selectWinnersNamesFromState = (state: IState) =>
	selectWinnersNamesFromAppState(state.app)
