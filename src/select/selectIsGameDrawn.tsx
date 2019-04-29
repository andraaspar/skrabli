import { createSelector } from 'reselect'
import { selectWinners } from './selectWinners'
import { selectPlayers } from './simpleSelectors'

export const selectIsGameDrawn = createSelector(
	[selectPlayers, selectWinners],
	(players, winners) => {
		return players.length === winners.length
	},
)
