import { createSelector } from 'reselect'
import { getHandValue } from '../fun/getHandValue'
import { IState } from '../model/State'
import { selectHandsFromAppState } from './simpleSelectors'

export const selectEmptyHandBonusFromAppState = createSelector(
	[selectHandsFromAppState],
	hands => {
		return hands.reduce((sum, hand) => sum + getHandValue(hand), 0)
	},
)

export const selectEmptyHandBonusFromState = (state: IState) =>
	selectEmptyHandBonusFromAppState(state.app)
