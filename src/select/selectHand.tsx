import { isUndefinedOrNull } from 'illa/Type'
import { createSelector } from 'reselect'
import { IState } from '../model/State'
import {
	selectHandsFromAppState,
	selectPlayerIndexFromAppState,
} from './simpleSelectors'

export const selectHandFromAppState = createSelector(
	[selectHandsFromAppState, selectPlayerIndexFromAppState],
	(hands, playerIndex) => {
		return isUndefinedOrNull(playerIndex) ? null : hands[playerIndex]
	},
)

export const selectHandFromState = (s: IState) => selectHandsFromAppState(s.app)
