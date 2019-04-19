import { isUndefinedOrNull } from 'illa/Type'
import { createSelector } from 'reselect'
import { IState } from '../model/State'
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
export const selectFieldFromState = (s: IState) =>
	selectFieldFromAppState(s.app)
