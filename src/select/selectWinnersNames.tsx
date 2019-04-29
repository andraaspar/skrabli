import { createSelector } from 'reselect'
import { IState } from '../model/State'
import { selectWinnersFromAppState } from './selectWinners'

export const selectWinnersNamesFromAppState = createSelector(
	[selectWinnersFromAppState],
	winners => {
		if (winners.length === 0) return ``
		const last = winners[winners.length - 1]
		const rest = winners.slice(0, winners.length - 1)
		return `${rest.join(', ')} és ${last}`
	},
)

export const selectWinnersNamesFromState = (state: IState) =>
	selectWinnersNamesFromAppState(state.app)
