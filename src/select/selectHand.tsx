import { isUndefinedOrNull } from 'illa/Type'
import { createSelector } from 'reselect'
import { selectHands, selectPlayerIndex } from './simpleSelectors'

export const selectHand = createSelector(
	[selectHands, selectPlayerIndex],
	(hands, playerIndex) => {
		return isUndefinedOrNull(playerIndex) ? null : hands[playerIndex]
	},
)
