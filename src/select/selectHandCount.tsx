import { isUndefinedOrNull } from 'illa/Type'
import { createSelector } from 'reselect'
import { IState } from '../model/State'
import { selectHandFromAppState } from './selectHand'

export const selectHandCountFromAppState = createSelector(
	[selectHandFromAppState],
	hand =>
		(hand || []).reduce(
			(sum, tile) => sum + (isUndefinedOrNull(tile) ? 0 : 1),
			0,
		),
)

export const selectHandCountFromState = (state: IState) =>
	selectHandCountFromAppState(state.app)
