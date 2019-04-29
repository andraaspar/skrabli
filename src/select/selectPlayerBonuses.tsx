import { createSelector } from 'reselect'
import { isNull } from 'util'
import { getHandValue } from '../fun/getHandValue'
import { IState } from '../model/State'
import { selectEmptyHandBonusFromAppState } from './selectEmptyHandBonus'
import { selectHandsFromAppState } from './simpleSelectors'

export const selectPlayerBonusesFromAppState = createSelector(
	[selectHandsFromAppState, selectEmptyHandBonusFromAppState],
	(hands, emptyHandBonus) => {
		return hands.map(hand => {
			if (hand.filter(isNull).length === 7) {
				return emptyHandBonus
			} else {
				return -getHandValue(hand)
			}
		})
	},
)

export const selectPlayerBonusesFromState = (state: IState) =>
	selectPlayerBonusesFromAppState(state.app)
