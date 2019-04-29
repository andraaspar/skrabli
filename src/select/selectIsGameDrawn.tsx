import { createSelector } from 'reselect'
import { IState } from '../model/State'
import { selectWinnersFromAppState } from './selectWinners'
import { selectPlayersFromAppState } from './simpleSelectors'

export const selectIsGameDrawnFromAppState = createSelector(
	[selectPlayersFromAppState, selectWinnersFromAppState],
	(players, winners) => {
		return players.length === winners.length
	},
)

export const selectIsGameDrawnFromState = (state: IState) =>
	selectIsGameDrawnFromAppState(state.app)
