import { createSelector } from 'reselect'
import { getHandValue } from '../fun/getHandValue'
import { selectEmptyHandBonus } from './selectEmptyHandBonus'
import { selectHands } from './simpleSelectors'

export const selectPlayerBonuses = createSelector(
	[selectHands, selectEmptyHandBonus],
	(hands, emptyHandBonus) => {
		return hands.map((hand) => {
			if (hand.filter((it) => it == null).length === 7) {
				return emptyHandBonus
			} else {
				return -getHandValue(hand)
			}
		})
	},
)
