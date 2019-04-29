import { isUndefinedOrNull } from 'illa/Type'
import { createSelector } from 'reselect'
import { selectBoard, selectFieldIndex } from './simpleSelectors'

export const selectField = createSelector(
	[selectBoard, selectFieldIndex],
	(board, fieldIndex) => {
		return isUndefinedOrNull(fieldIndex) ? null : board[fieldIndex]
	},
)
