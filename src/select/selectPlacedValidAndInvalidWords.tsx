import { isUndefinedOrNull } from 'illa/Type'
import { createSelector } from 'reselect'
import { getWordsAt } from '../fun/getWordsAt'
import { getWordString } from '../fun/getWordString'
import { isWordStringValid } from '../fun/isWordStringValid'
import { IField } from '../model/Field'
import { IValidAndInvalidWords } from '../model/IValidAndInvalidWords'
import { selectBoard, selectFieldIndex } from './simpleSelectors'

export const selectPlacedValidAndInvalidWords = createSelector(
	[selectFieldIndex, selectBoard],
	(fieldIndex, board): IValidAndInvalidWords | null => {
		if (isUndefinedOrNull(fieldIndex)) return null
		const field = board[fieldIndex]
		if (!field || !field.tile || field.tile.isOwned) return null
		const w = getWordsAt(board, fieldIndex)
		const words = [w.horizontal.word, w.vertical.word].filter(
			word => word.length > 1,
		)
		const valid: IField[][] = []
		const invalid: IField[][] = []
		for (let word of words) {
			if (isWordStringValid(getWordString(word))) {
				valid.push(word)
			} else {
				invalid.push(word)
			}
		}
		if (valid.length > 0 || invalid.length > 0) {
			return {
				valid,
				invalid,
			}
		} else {
			return null
		}
	},
)
