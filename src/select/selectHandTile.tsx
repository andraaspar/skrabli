import { isUndefinedOrNull } from 'illa/Type'
import { createSelector } from 'reselect'
import { selectHand } from './selectHand'
import { selectHandIndex } from './simpleSelectors'

export const selectHandTile = createSelector(
	[selectHand, selectHandIndex],
	(hand, handIndex) => {
		return hand && !isUndefinedOrNull(handIndex) ? hand[handIndex] : null
	},
)
