import { isUndefinedOrNull } from 'illa/Type'
import { createSelector } from 'reselect'
import { TState } from '../index'
import {
	selectBoardFromAppState,
	selectFieldIndexFromAppState,
} from './simpleSelectors'

export const selectFieldFromAppState = createSelector(
	[selectBoardFromAppState, selectFieldIndexFromAppState],
	(board, fieldIndex) => {
		return isUndefinedOrNull(fieldIndex) ? null : board[fieldIndex]
	},
)
export const selectFieldFromState = (s: TState) =>
	selectFieldFromAppState(s.app)
