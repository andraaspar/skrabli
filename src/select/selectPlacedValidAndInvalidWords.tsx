import { isUndefinedOrNull } from 'illa/Type'
import { createSelector } from 'reselect'
import { getWordAt } from '../fun/getWordAt'
import { Direction } from '../model/Direction'
import { IValidAndInvalidWords } from '../model/IValidAndInvalidWords'
import { selectBoard, selectFieldIndex } from './simpleSelectors'

export const selectPlacedValidAndInvalidWords = createSelector(
	[selectFieldIndex, selectBoard],
	(fieldIndex, board): IValidAndInvalidWords | null => {
		if (isUndefinedOrNull(fieldIndex)) return null
		const field = board[fieldIndex]
		if (!field || !field.tile || field.tile.isOwned) return null
		const words = [
			getWordAt(board, fieldIndex, Direction.Horizontal).word,
			getWordAt(board, fieldIndex, Direction.Vertical).word,
		].filter((word) => word.length > 1)
		return {
			valid: words,
			invalid: [],
		}
	},
)
