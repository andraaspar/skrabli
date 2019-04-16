import { isUndefinedOrNull } from 'illa/Type'
import memoizee from 'memoizee'
import { CENTER_FIELD_INDEX } from '../model/Constants'
import { IField } from '../model/Field'
import { FieldKind } from '../model/FieldKind'
import { MoveError } from '../model/MoveError'
import { getAllOwnedWords } from './getAllOwnedWords'
import { getWordInfo } from './getWordInfo'
import { getWordString } from './getWordString'
import { isWordStringValid } from './isWordStringValid'

export const validateMove = memoizee(
	(board: ReadonlyArray<IField>) => {
		const { firstFieldIndex, lastFieldIndex, direction } = getWordInfo(
			board,
		)
		const errors: Set<MoveError> = new Set()
		if (isUndefinedOrNull(firstFieldIndex)) {
			errors.add(MoveError.NoTile)
		}
		if (errors.size === 0) {
			if (firstFieldIndex === lastFieldIndex) {
				errors.add(MoveError.OneTile)
			}
			if (errors.size === 0) {
				if (isUndefinedOrNull(direction)) {
					errors.add(MoveError.NoDirection)
				}
				if (errors.size === 0) {
					let touchesStart = false
					let touchesUnowned = false
					const words = getAllOwnedWords(board)
					for (const word of words) {
						if (!isWordStringValid(getWordString(word))) {
							errors.add(MoveError.InvalidWord)
						}
						for (const field of word) {
							if (field.kind === FieldKind.Start) {
								touchesStart = true
							}
							if (field.tile && !field.tile.isOwned) {
								touchesUnowned = true
							}
						}
					}
					if (isUndefinedOrNull(board[CENTER_FIELD_INDEX].tile)) {
						errors.add(MoveError.NoStart)
					} else if (!touchesUnowned && !touchesStart) {
						errors.add(MoveError.NoConnection)
					}
				}
			}
		}
		return errors
	},
	{ max: 1 },
)
