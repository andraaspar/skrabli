import { createSelector } from 'reselect'
import { getHandValue } from '../fun/getHandValue'
import { selectHands } from './simpleSelectors'

export const selectEmptyHandBonus = createSelector(
	[selectHands],
	hands => {
		return hands.reduce((sum, hand) => sum + getHandValue(hand), 0)
	},
)
