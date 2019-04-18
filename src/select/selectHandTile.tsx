import { isUndefinedOrNull } from 'illa/Type'
import { createSelector } from 'reselect'
import { TState } from '../index'
import { selectHandFromAppState } from './selectHand'
import { selectHandIndexFromAppState } from './simpleSelectors'

export const selectHandTileFromAppState = createSelector(
	[selectHandFromAppState, selectHandIndexFromAppState],
	(hand, handIndex) => {
		return hand && !isUndefinedOrNull(handIndex) ? hand[handIndex] : null
	},
)

export const selectHandTileFromState = (state: TState) =>
	selectHandTileFromAppState(state.app)
