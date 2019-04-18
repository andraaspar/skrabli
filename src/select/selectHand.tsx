import { isUndefinedOrNull } from 'illa/Type'
import { createSelector } from 'reselect'
import { TState } from '../index'
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

export const selectHandFromState = (s: TState) => selectHandsFromAppState(s.app)
