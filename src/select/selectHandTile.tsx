import { isUndefinedOrNull } from 'illa/Type'
import { createSelector } from 'reselect'
import { IState } from '../model/State'
import { selectHandFromAppState } from './selectHand'
import { selectHandIndexFromAppState } from './simpleSelectors'

export const selectHandTileFromAppState = createSelector(
	[selectHandFromAppState, selectHandIndexFromAppState],
	(hand, handIndex) => {
		return hand && !isUndefinedOrNull(handIndex) ? hand[handIndex] : null
	},
)

export const selectHandTileFromState = (state: IState) =>
	selectHandTileFromAppState(state.app)
