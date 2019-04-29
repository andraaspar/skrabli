import { createSelector } from 'reselect'
import { selectWinners } from './selectWinners'

export const selectWinnersNames = createSelector(
	[selectWinners],
	winners => {
		if (winners.length === 0) return ``
		const winnerNames = winners.map(winner => winner.name)
		const last = winnerNames[winnerNames.length - 1]
		const rest = winnerNames.slice(0, winnerNames.length - 1)
		return rest.length ? `${rest.join(', ')} és ${last}` : last
	},
)
