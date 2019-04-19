import { createSelector } from 'reselect'
import { IState } from '../model/State'
import { selectHandCountFromAppState } from './selectHandCount'
import { selectStartingHandCountFromAppState } from './simpleSelectors'

export const selectIsBingoFromAppState = createSelector(
	[selectStartingHandCountFromAppState, selectHandCountFromAppState],
	(startingHandCount, handCount) => {
		return startingHandCount === 7 && handCount === 0
	},
)

export const selectIsBingoFromState = (state: IState) =>
	selectIsBingoFromAppState(state.app)
